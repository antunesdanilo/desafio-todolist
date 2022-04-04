/**
 * @author {Danilo Antunes}
 * @extends BaseController
 */

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'

import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class UserController extends BaseController {
  /**
   * Shows the registered users
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async index({ response, auth }: HttpContextContract) {
    const users = await User.query().whereNot({ user_id: auth.user?.user_id })
    return this.sendResponse(response, users)
  }

  /**
   * Shows the authenticated user
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async show({ response, auth }: HttpContextContract) {
    const user = await User.query().where({ user_id: auth.user?.user_id }).first()
    return this.sendResponse(response, user)
  }

  /**
   * Creates a new user
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async store({ request, response }: HttpContextContract) {
    const { name, email, password, passwordConfirm } = await request.validate(RegisterValidator)

    if (password !== passwordConfirm) {
      return this.sendError(response, 'Senhas não conferem', 400)
    }

    const exists = await User.query().where({ email }).limit(1).first()
    if (exists) {
      return this.sendError(response, 'Já existe um usuário cadastrado com este e-mail', 400)
    }

    try {
      const user = await User.create({ name, email, password })
      return this.sendResponse(response, user, null, 201)
    } catch (error) {
      return this.sendError(response, error.code + ' - ' + error.sqlMessage, 500)
    }
  }
}
