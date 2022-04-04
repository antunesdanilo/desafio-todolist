import test from 'japa'
import Database from '@ioc:Adonis/Lucid/Database'

import supertest from 'supertest'

import User from 'App/Models/User'
import Todo from 'App/Models/Todo'

const BASE_URL = 'http://localhost:3333'

const user = {
  name: 'João da Silva',
  email: 'joao@joao.com',
  password: '6798795465',
}

const todo = {
  name: 'Minha Todo de Teste',
  url: 'minha-todo-de-teste',
  nameUpdated: 'Minha Todo de Teste Atualizada',
  urlUpdated: 'minha-todo-de-test-atualizada',
}

test.group('Todo', (group) => {
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

  test('It should be able to insert a todo', async (assert) => {
    await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const response2 = await supertest(BASE_URL)
      .post('/todo')
      .send({ name: todo.name, url: todo.url })
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 201)
    assert.hasAnyKeys(response2.body, ['data'])
    assert.hasAnyKeys(response2.body.data, ['todo_id'])
    const todoDb = await Todo.find(response2.body.data.todo_id)
    assert.equal(!!todoDb, true)
    assert.equal(todoDb?.name, todo.name)
    assert.equal(todoDb?.url, todo.url)
  })

  test('It should be able to update a todo', async (assert) => {
    const userDb = await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const todoDb = await Todo.create({ user_id: userDb.user_id, name: todo.name, url: todo.url })
    const response2 = await supertest(BASE_URL)
      .put(`/todo/${todoDb.todo_id}`)
      .send({ name: todo.nameUpdated, url: todo.urlUpdated })
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 200)
    assert.hasAnyKeys(response2.body, ['data'])
    assert.hasAnyKeys(response2.body.data, ['todo_id'])
    const todoUpdated = await Todo.find(todoDb.todo_id)
    assert.equal(!!todoUpdated, true)
    assert.equal(todoUpdated?.name, todo.nameUpdated)
    assert.equal(todoUpdated?.url, todo.urlUpdated)
  })

  test('It should be able to remove a todo belonging to the authenticated user', async (assert) => {
    const userDb = await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const todoDb = await Todo.create({ user_id: userDb.user_id, name: todo.name, url: todo.url })
    const response2 = await supertest(BASE_URL)
      .delete(`/todo/${todoDb.todo_id}`)
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 204)
    const todoDbExists = await Todo.find(todoDb.todo_id)
    assert.equal(!!todoDbExists, false)
  })

  test('It should not be able to remove a todo that does not belong to the authenticated user', async (assert) => {
    const userDb = await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })
    const todoDb = await Todo.create({
      user_id: userDb.user_id + 999,
      name: todo.name,
      url: todo.url,
    })
    const response2 = await supertest(BASE_URL)
      .delete(`/todo/${todoDb.todo_id}`)
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 403)
    const todoDbExists = await Todo.find(todoDb.todo_id)
    assert.equal(!!todoDbExists, true)
  })
})
