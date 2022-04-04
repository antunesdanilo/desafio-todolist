import test from 'japa'
import Database from '@ioc:Adonis/Lucid/Database'

import supertest from 'supertest'

import User from 'App/Models/User'
import Todo from 'App/Models/Todo'
import Sharing from 'App/Models/Sharing'

const BASE_URL = 'http://localhost:3333'

const user = {
  name: 'João da Silva',
  email: 'joao@joao.com',
  password: '6798795465',
}

const todo = {
  name: 'Minha Todo de Teste',
  url: 'minha-todo-de-teste',
}

test.group('Developer', (group) => {
  group.before(async () => {
    await Database.rawQuery('delete from api_tokens')
    await Database.rawQuery('delete from sharings')
    await Database.rawQuery('delete from tasks')
    await Database.rawQuery('delete from todos')
    await Database.rawQuery('delete from users')
    await Database.rawQuery('alter table api_tokens auto_increment = 1')
    await Database.rawQuery('alter table sharings auto_increment = 1')
    await Database.rawQuery('alter table tasks auto_increment = 1')
    await Database.rawQuery('alter table todos auto_increment = 1')
    await Database.rawQuery('alter table users auto_increment = 1')
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('It should be able to share a todo list created by authenticated user', async (assert) => {
    const userDb = await User.create(user)
    const userToShare = await User.create(user)
    const todoDb = await Todo.create({ user_id: userDb.user_id, ...todo })
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const response2 = await supertest(BASE_URL)
      .post('/sharing')
      .send({ todo_id: todoDb.todo_id, user_shared_id: userToShare.user_id })
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 201)
    assert.hasAnyKeys(response2.body, ['data'])
    assert.hasAnyKeys(response2.body.data, ['sharing_id'])
    const sharingDb = await Sharing.find(response2.body.data.sharing_id)
    assert.equal(!!sharingDb, true)
    assert.equal(sharingDb?.user_id, userDb.user_id)
    assert.equal(sharingDb?.user_shared_id, userToShare.user_id)
  })

  test('It should be able to remove a sharing of a todo list created by authenticated user', async (assert) => {
    const userDb = await User.create(user)
    const userToShare = await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const sharingDb = await Sharing.create({
      user_id: userDb.user_id,
      user_shared_id: userToShare.user_id,
    })
    const response2 = await supertest(BASE_URL)
      .delete(`/sharing/${sharingDb.sharing_id}`)
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 204)
    const sharingDbExists = await Sharing.find(sharingDb.sharing_id)
    assert.equal(!!sharingDbExists, false)
  })
})
