/**
 * @author {Danilo Antunes}
 * @extends BaseController
 */

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import BaseController from './BaseController'
import User from 'App/Models/User'

import LoginValidator from 'App/Validators/LoginValidator'

export default class AuthController extends BaseController {
  /**
   * Checks access credentials and creates api token
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async login({ request, response, auth }: HttpContextContract): Promise<void> {
    const { email, password } = await request.validate(LoginValidator)

    const user = await User.query().where({ email }).limit(1).first()

    if (!user || !(await Hash.verify(user.password, password))) {
      return this.sendError(response, 'Usuário não encontrado ou senha incorreta', 401)
    }

    const token = await auth.use('api').generate(user, {
      expiresIn: 1800000,
    })

    return this.sendResponse(response, { user, token }, 'Logado com sucesso')
  }

  /**
   * Checks if the api token is still valid
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async getCurrentUser({ auth, response }: HttpContextContract): Promise<void> {
    const user = auth.user
    await auth.use('api').authenticate()
    return this.sendResponse(response, { user }, 'Sessão recuperada')
  }

  /**
   * Destroys the api token
   * @param {HttpContextContract}
   * @returns {Promise<void>}
   */
  public async logout({ auth, response }: HttpContextContract): Promise<void> {
    await auth.use('api').revoke()
    return this.sendResponse(response, null, 'Logout realizado', 204)
  }
}
