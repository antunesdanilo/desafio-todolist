/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world - todolist' }
})

Route.group(() => {
  Route.group(() => {
    Route.post('login/password', 'AuthController.login')
    Route.get('login/token', 'AuthController.getCurrentUser').middleware('auth')
    Route.delete('logout', 'AuthController.logout').middleware('auth')
  }).prefix('/auth')

  Route.group(() => {
    Route.get('', 'UserController.show').middleware('auth')
    Route.post('', 'UserController.store')
  }).prefix('/user')

  Route.get('/users', 'UserController.index').middleware('auth')

  Route.group(() => {
    Route.get('', 'TodoController.list').middleware('auth')
    Route.get('shared', 'TodoController.listShared').middleware('auth')
    Route.get(':id', 'TodoController.show').middleware('auth')
    Route.post('', 'TodoController.store').middleware('auth')
    Route.put(':id', 'TodoController.update').middleware('auth')
    Route.delete(':id', 'TodoController.destroy').middleware('auth')
  }).prefix('/todo')

  Route.group(() => {
    Route.get('', 'TaskController.list').middleware('auth')
    Route.post('', 'TaskController.store').middleware('auth')
    Route.put(':id', 'TaskController.update').middleware('auth')
    Route.delete(':id', 'TaskController.destroy').middleware('auth')
  }).prefix('/task')

  Route.group(() => {
    Route.get('', 'SharingController.list').middleware('auth')
    Route.post('', 'SharingController.store').middleware('auth')
    Route.delete(':id', 'SharingController.destroy').middleware('auth')
  }).prefix('/sharing')
}).namespace('App/Controllers/Http')

Route.any('*', async ({ response }) => {
  return response.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    code: 404,
  })
})
