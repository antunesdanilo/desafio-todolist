/**
 * @author {Danilo Antunes}
 */

import { ResponseContract } from '@ioc:Adonis/Core/Response'

export default abstract class BaseController {
  /**
   * Send error response to the client
   * @param {ResponseContract} response
   * @param {any} data  [d=null]
   * @param {string} message [d=null]
   * @param {number} code
   * @returns {void}
   */
  public sendResponse(
    response: ResponseContract,
    data: any = null,
    message: string | null = null,
    code: number = 200
  ) {
    return response.status(code).json({
      success: true,
      message,
      data,
    })
  }

  /**
   * Send Success Response to the client
   * @param {ResponseContract} response
   * @param {string} message
   * @param {number} code [d=500]
   * @returns {void}
   */
  public sendError(response: ResponseContract, message: string, code: number = 500) {
    return response.status(code).json({
      errors: [
        {
          success: false,
          message,
          code,
        },
      ],
    })
  }
}
