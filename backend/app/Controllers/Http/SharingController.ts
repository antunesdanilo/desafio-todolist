/**
 * @author {Danilo Antunes}
 * @extends BaseController
 */

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'

import SharingValidator from 'App/Validators/SharingValidator'
import Todo from 'App/Models/Todo'
import Sharing from 'App/Models/Sharing'

export default class SharingController extends BaseController {
  /**
   * Lists users with then todo is shared
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

    const isOwner = auth.user?.user_id === todo.user_id

    if (!isOwner) {
      return this.sendError(
        response,
        'Você não possui permissão para compartilhar esta lista.',
        403
      )
    }

    const sharings = await Sharing.query().where({ todo_id: todoId }).preload('user_shared')

    return this.sendResponse(response, sharings)
  }

  /**
   * Add a user in the list of sharing of the todo
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async store({ request, response, auth }: HttpContextContract) {
    const { user_shared_id, todo_id } = await request.validate(SharingValidator)

    const todo = await Todo.query().where({ todo_id }).limit(1).first()

    if (!todo) {
      return this.sendError(
        response,
        'Não foi encontrada uma lista de tarefas associada a este ID.',
        404
      )
    }

    const isOwner = auth.user?.user_id === todo.user_id

    if (!isOwner) {
      return this.sendError(
        response,
        'Você não possui permissão para compartilhar esta lista.',
        403
      )
    }

    const exists = await Sharing.query().where({ todo_id, user_shared_id }).limit(1).first()
    if (exists) {
      return this.sendError(response, 'Você já compartilhou a lista com esta pessoa.', 400)
    }

    try {
      const sharing = await Sharing.create({ user_id: auth.user?.user_id, user_shared_id, todo_id })
      return this.sendResponse(response, sharing, null, 201)
    } catch (error) {
      return this.sendError(response, error.code, 500)
    }
  }

  /**
   * Remove a user in the list of sharing of the todo
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async destroy({ response, params, auth }: HttpContextContract) {
    const sharingId = parseInt(params.id)

    if (!sharingId) {
      return this.sendError(response, 'ID informado é inválido.', 400)
    }

    const sharing = await Sharing.query().where({ sharing_id: sharingId }).limit(1).first()

    if (!sharing) {
      return this.sendError(
        response,
        'Não foi encontrada um compartilhamento associado a este ID.',
        404
      )
    }

    const isOwner = auth.user?.user_id === sharing.user_id

    if (!isOwner) {
      return this.sendError(
        response,
        'Você não possui permissão para remover este compartlhamento.',
        403
      )
    }

    try {
      sharing.delete()

      this.sendResponse(response, null, null, 204)
    } catch (error) {
      return this.sendError(response, error.code, 500)
    }
  }
}
