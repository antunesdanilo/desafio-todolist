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

test.group('Auth', (group) => {
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

  test('It should authenticate with valid credentials and return jwt token', async (assert) => {
    await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })
    assert.equal(response.status, 200)
    assert.hasAnyKeys(response.body, ['data'])
    assert.hasAnyKeys(response.body.data, ['token'])
    assert.hasAnyKeys(response.body.data, ['user'])
  })

  test('It should not be able to authenticate with invalid user', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: 'email@email.com', password: 'aaaaaaa' })
    assert.equal(response.status, 401)
  })

  test('It should not be to authenticate with invalid password', async (assert) => {
    await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: 'aaaaaaa' })
    assert.equal(response.status, 401)
  })

  test('It should be able to access private routes when authenticated', async (assert) => {
    await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })
    const response2 = await supertest(BASE_URL)
      .get('/user')
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 200)
  })

  test('It should not be able to access private routes without jwt token', async (assert) => {
    const response = await supertest(BASE_URL).get('/user')
    assert.equal(response.status, 401)
  })

  test('It should not be able to access private routes with invalid jwt token', async (assert) => {
    const response = await supertest(BASE_URL).get('/user').set('Authorization', 'dfasdfasdsdf')
    assert.equal(response.status, 401)
  })

  test('It should authenticate with valid jwt token', async (assert) => {
    await User.create(user)
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })
    const response2 = await supertest(BASE_URL)
      .get('/auth/login/token')
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 200)
  })

  test('It should not be able to authenticate without jwt token', async (assert) => {
    const response = await supertest(BASE_URL).get('/auth/login/token')
    assert.equal(response.status, 401)
  })

  test('It should not be able to authenticate with invalid jwt token', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/auth/login/token')
      .set('Authorization', 'ieupqrouasldfasfasd')
    assert.equal(response.status, 401)
  })
})
