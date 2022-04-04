/**
 * @author {Danilo Antunes}
 * @extends BaseController
 */

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'

import TaskValidator from 'App/Validators/TaskValidator'
import TaskUpdateValidator from 'App/Validators/TaskUpdateValidator'
import Todo from 'App/Models/Todo'
import Sharing from 'App/Models/Sharing'
import Task from 'App/Models/Task'

export default class TodoController extends BaseController {
  /**
   * Shows the tasks of a todo lists
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async list({ request, response, auth }: HttpContextContract) {
    const todoId = parseInt(request.qs().todo_id)

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

    const isShared = await Sharing.query()
      .where({ todo_id: todoId, user_shared_id: auth.user?.user_id })
      .limit(1)
      .first()

    if (!isOwner && !isShared) {
      return this.sendError(
        response,
        'Você não possui permissão para visualizar as tarefas desta lista',
        403
      )
    }

    const tasks = await Task.query()
      .where({ parent_id: null, todo_id: todoId })
      .preload('user')
      .preload('tasks', (t) => t.preload('user'))

    return this.sendResponse(response, tasks)
  }

  /**
   * Creates a new task
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async store({ request, response, auth }: HttpContextContract) {
    const { todo_id, parent_id, name, deadline } = await request.validate(TaskValidator)

    const todo = await Todo.query().where({ todo_id }).limit(1).first()

    const isOwner = todo?.user_id === auth.user?.user_id

    const isShared = await Sharing.query()
      .where({ todo_id, user_shared_id: auth.user?.user_id })
      .limit(1)
      .first()

    if (!isOwner && !isShared) {
      return this.sendError(
        response,
        'Você não possui permissão para adicionar uma tarefa nesta lista',
        403
      )
    }

    try {
      const task = await Task.create({
        user_id: auth.user?.user_id,
        parent_id,
        todo_id,
        name,
        deadline: new Date(deadline.toISO()),
      })
      return this.sendResponse(response, task, null, 201)
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
    const { parent_id, name, deadline, checked } = await request.validate(TaskUpdateValidator)

    const taskId = parseInt(params.id)

    if (!taskId) {
      return this.sendError(response, 'ID informado é inválido.', 400)
    }

    const task = await Task.query().where({ task_id: taskId }).limit(1).first()

    if (!task) {
      return this.sendError(response, 'Não foi encontrada uma tarefa a este ID.', 404)
    }

    const todo = await Todo.query().where({ todo_id: task.todo_id }).limit(1).first()

    const isOwner = todo?.user_id === auth.user?.user_id

    const isShared = await Sharing.query()
      .where({ todo_id: task.todo_id, user_shared_id: auth.user?.user_id })
      .limit(1)
      .first()

    if (!isOwner && !isShared) {
      return this.sendError(
        response,
        'Você não possui permissão para editar a tarefa associada a este ID',
        403
      )
    }

    try {
      await task
        .merge({
          parent_id,
          name: name || undefined,
          deadline: deadline ? new Date(deadline.toISO()) : undefined,
          checked: checked !== null ? checked : undefined,
        })
        .save()

      this.sendResponse(response, task)
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
    const taskId = parseInt(params.id)

    if (!taskId) {
      return this.sendError(response, 'ID informado é inválido.', 400)
    }

    const task = await Task.query().where({ task_id: taskId }).limit(1).first()

    if (!task) {
      return this.sendError(response, 'Não foi encontrada uma tarefa associada a este ID.', 404)
    }

    // Verifys if user is owner of task
    const isOwnerTask = task.user_id === auth.user?.user_id

    const todo = await Todo.query().where({ todo_id: task.todo_id }).limit(1).first()

    // Verifys if user is owner of todo
    const isOwnerTodo = todo?.user_id === auth.user?.user_id

    // Verifys if user is shared of todo
    const isShared = await Sharing.query()
      .where({ todo_id: task.todo_id, user_shared_id: auth.user?.user_id })
      .limit(1)
      .first()

    // Can only remove if the user is the owner of the todo
    // or
    // if user is shared todo and is the owner of the task
    if (!isOwnerTodo && !(isShared && isOwnerTask)) {
      return this.sendError(
        response,
        'Você não possui permissão para excluir a tarefa associada a este ID.',
        403
      )
    }

    try {
      task.delete()

      this.sendResponse(response, null, null, 204)
    } catch (error) {
      return this.sendError(response, error.code, 500)
    }
  }
}
