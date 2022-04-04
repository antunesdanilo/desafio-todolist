import test from 'japa'
import Database from '@ioc:Adonis/Lucid/Database'

import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = 'http://localhost:3333'

const user = {
  name: 'João da Silva',
  email: 'joao@joao.com',
  password: '6798795465',
}

test.group('User', (group) => {
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

  test('should view the logged user', async (assert) => {
    await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })
    const response2 = await await supertest(BASE_URL)
      .get('/user')
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 200)
    assert.hasAnyKeys(response2.body, ['data'])
    assert.hasAnyKeys(response2.body.data, ['user_id'])
    assert.equal(response2.body.data.email, user.email)
    assert.equal(response2.body.data.name, user.name)
  })

  test('should be possible create a user', async (assert) => {
    const response = await supertest(BASE_URL).post('/user').send({
      name: user.name,
      email: user.email,
      password: user.password,
      passwordConfirm: user.password,
    })
    assert.equal(response.status, 201)
    assert.hasAnyKeys(response.body, ['data'])
    assert.hasAnyKeys(response.body.data, ['user_id'])
    const userDb = await User.find(response.body.data.user_id)
    assert.equal(!!userDb, true)
    assert.equal(userDb?.user_id, response.body.data.user_id)
    assert.equal(userDb?.email, response.body.data.email)
    assert.equal(userDb?.name, response.body.data.name)
  })
})
