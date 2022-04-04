/**
 * @author {Danilo Antunes}
 * @extends BaseController
 */

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'

import TodoValidator from 'App/Validators/TodoValidator'
import Todo from 'App/Models/Todo'
import Sharing from 'App/Models/Sharing'

export default class TodoController extends BaseController {
  /**
   * Shows the todo lists created by authenticated user
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async list({ response, auth }: HttpContextContract) {
    const lists = await Todo.query()
      .where({ user_id: auth.user?.user_id })
      .withCount('tasks', (t) => t.as('tasks_count'))
      .withCount('tasks', (t) => t.where('checked', true).as('tasks_checked_count'))
      .withCount('tasks', (t) => t.where('checked', false).as('tasks_unchecked_count'))
    return this.sendResponse(response, lists)
  }

  /**
   * Shows the todo lists shared with authenticated user
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async listShared({ response, auth }: HttpContextContract) {
    const lists = await Sharing.query()
      .where({ user_shared_id: auth.user?.user_id })
      .preload('todo', (t) => {
        t.withCount('tasks', (t) => t.as('tasks_count'))
        t.withCount('tasks', (t) => t.where('checked', true).as('tasks_checked_count'))
        t.withCount('tasks', (t) => t.where('checked', false).as('tasks_unchecked_count'))
      })

    const listsMapped = lists.map((l) => l.todo)

    return this.sendResponse(response, listsMapped)
  }

  /**
   * Shows details of a list created by authenticated user or shared with them
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async show({ response, auth, params }: HttpContextContract) {
    const todoId = parseInt(params.id)

    if (!todoId) {
      return this.sendError(response, 'ID informado é inválido.', 400)
    }

    const todo = await Todo.query().where({ todo_id: todoId }).limit(1).first()

    if (!todo) {
      return this.sendError(
        response,
        'Não foi encontrada uma lista de tarefas associada a este ID.',
        404
      )
    }

    const isOwner = todo.user_id === auth.user?.user_id

    if (isOwner) {
      return this.sendResponse(response, { todo, shared: false })
    }

    const isShared = await Sharing.query()
      .where({ todo_id: todoId, user_shared_id: auth.user?.user_id })
      .limit(1)
      .first()

    if (isShared) {
      return this.sendResponse(response, { todo, shared: true })
    }

    return this.sendError(
      response,
      'Você não tem permissão para visualizar esta lista de tarefas',
      403
    )
  }

  /**
   * Creates a new todo list
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async store({ request, response, auth }: HttpContextContract) {
    const { name, url } = await request.validate(TodoValidator)

    try {
      const todo = await Todo.create({ user_id: auth.user?.user_id, name, url })
      return this.sendResponse(response, todo, null, 201)
    } catch (error) {
      return this.sendError(response, error.code, 500)
    }
  }

  /**
   * Update a todo list owned by authenticated user
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async update({ request, response, params, auth }: HttpContextContract) {
    const { name, url } = await request.validate(TodoValidator)

    const todoId = parseInt(params.id)

    if (!todoId) {
      return this.sendError(response, 'ID informado é inválido.', 400)
    }

    const todo = await Todo.query().where({ todo_id: todoId }).limit(1).first()

    if (!todo) {
      return this.sendError(
        response,
        'Não foi encontrada uma lista de tarefas associada a este ID.',
        404
      )
    }

    if (todo.user_id !== auth.user?.user_id) {
      return this.sendError(
        response,
        'Você não possui permissão para editar a lista de tarefas associada a este ID.',
        403
      )
    }

    try {
      await todo.merge({ name, url }).save()

      this.sendResponse(response, todo)
    } catch (error) {
      return this.sendError(response, error.code, 500)
    }
  }

  /**
   * Remove a todo list owned by authenticated user
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async destroy({ response, params, auth }: HttpContextContract) {
    const todoId = parseInt(params.id)

    if (!todoId) {
      return this.sendError(response, 'ID informado é inválido.', 400)
    }

    const todo = await Todo.query().where({ todo_id: todoId }).limit(1).first()

    if (!todo) {
      return this.sendError(
        response,
        'Não foi encontrada uma lista de tarefas associada a este ID.',
        404
      )
    }

    if (todo.user_id !== auth.user?.user_id) {
      return this.sendError(
        response,
        'Você não possui permissão para excluir a lista de tarefas associada a este ID.',
        403
      )
    }

    try {
      todo.delete()

      this.sendResponse(response, null, null, 204)
    } catch (error) {
      return this.sendError(response, error.code, 500)
    }
  }
}
