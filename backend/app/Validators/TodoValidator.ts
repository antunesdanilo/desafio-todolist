import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TodoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.required(), rules.minLength(5), rules.maxLength(50)]),
    url: schema.string({}, [rules.required(), rules.minLength(5), rules.maxLength(50)]),
  })

  public messages = {}
}
