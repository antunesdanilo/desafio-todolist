import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SharingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_shared_id: schema.number([
      rules.required(),
      rules.exists({ table: 'users', column: 'user_id' }),
    ]),
    todo_id: schema.number([rules.required(), rules.exists({ table: 'todos', column: 'todo_id' })]),
  })

  public messages = {}
}
