import test from 'japa'
import Database from '@ioc:Adonis/Lucid/Database'

import supertest from 'supertest'

import User from 'App/Models/User'
import Todo from 'App/Models/Todo'
import Task from 'App/Models/Task'

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

const task = {
  name: 'Minha Tarefa de Teste',
  deadline: '2022-08-31',
  deadlineDateFormat: new Date('2022-08-31'),
  nameUpdated: 'Minha Tarefa de Teste Atualizada',
  deadlineUpdated: '2022-09-30',
}

test.group('Task', (group) => {
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

  test('It should be able to insert a task', async (assert) => {
    const userDb = await User.create(user)
    const todoDb = await Todo.create({ user_id: userDb.user_id, ...todo })
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const response2 = await supertest(BASE_URL)
      .post('/task')
      .send({ todo_id: todoDb.todo_id, name: task.name, deadline: task.deadline })
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 201)
    assert.hasAnyKeys(response2.body, ['data'])
    assert.hasAnyKeys(response2.body.data, ['task_id'])
    const taskDb = await Task.find(response2.body.data.task_id)
    assert.equal(!!taskDb, true)
    assert.equal(taskDb?.name, task.name)
  })

  test('It should be able to update a task', async (assert) => {
    const userDb = await User.create(user)
    const todoDb = await Todo.create({ user_id: userDb.user_id, ...todo })
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const taskDb = await Task.create({
      user_id: userDb.user_id,
      todo_id: todoDb.todo_id,
      name: task.name,
      deadline: task.deadlineDateFormat,
    })
    const response2 = await supertest(BASE_URL)
      .put(`/task/${taskDb.task_id}`)
      .send({ name: task.nameUpdated, deadline: task.deadlineUpdated })
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 200)
    assert.hasAnyKeys(response2.body, ['data'])
    assert.hasAnyKeys(response2.body.data, ['task_id'])
    const taskUpdated = await Task.find(taskDb.task_id)
    assert.equal(!!taskUpdated, true)
    assert.equal(taskUpdated?.name, task.nameUpdated)
  })

  test('It should be able to check/uncheck a task', async (assert) => {
    const userDb = await User.create(user)
    const todoDb = await Todo.create({ user_id: userDb.user_id, ...todo })
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const taskDb = await Task.create({
      user_id: userDb.user_id,
      todo_id: todoDb.todo_id,
      name: task.name,
      deadline: task.deadlineDateFormat,
      checked: false,
    })
    const response2 = await supertest(BASE_URL)
      .put(`/task/${taskDb.task_id}`)
      .send({ checked: true })
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 200)
    assert.hasAnyKeys(response2.body, ['data'])
    assert.hasAnyKeys(response2.body.data, ['task_id'])
    const taskUpdated = await Task.find(taskDb.task_id)
    assert.equal(!!taskUpdated, true)
    assert.equal(taskUpdated?.checked, true)
  })

  test('It should be able to remove a task belonging to the authenticated user', async (assert) => {
    const userDb = await User.create(user)
    const todoDb = await Todo.create({ user_id: userDb.user_id, ...todo })
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const taskDb = await Task.create({
      user_id: userDb.user_id,
      todo_id: todoDb.todo_id,
      name: task.name,
      deadline: task.deadlineDateFormat,
    })
    const response2 = await supertest(BASE_URL)
      .delete(`/task/${taskDb.task_id}`)
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 204)
    const taskDbExists = await Task.find(taskDb.task_id)
    assert.equal(!!taskDbExists, false)
  })

  test('It should not be able to remove a todo that does not belong to the authenticated user', async (assert) => {
    const userDb = await User.create(user)
    const todoDb = await Todo.create({ user_id: userDb.user_id + 999, ...todo })
    const response = await supertest(BASE_URL)
      .post('/auth/login/password')
      .send({ email: user.email, password: user.password })

    const taskDb = await Task.create({
      user_id: userDb.user_id + 999,
      todo_id: todoDb.todo_id,
      name: task.name,
      deadline: task.deadlineDateFormat,
    })
    const response2 = await supertest(BASE_URL)
      .delete(`/task/${taskDb.task_id}`)
      .set('Authorization', `bearer ${response.body.data.token.token}`)
    assert.equal(response2.status, 403)
    const taskDbExists = await Task.find(taskDb.task_id)
    assert.equal(!!taskDbExists, true)
  })
})
