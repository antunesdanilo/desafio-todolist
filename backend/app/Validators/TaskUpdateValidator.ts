import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TaskUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    parent_id: schema.number.nullableAndOptional([]),
    name: schema.string.nullableAndOptional({}),
    deadline: schema.date.nullableAndOptional({}),
    checked: schema.boolean.nullableAndOptional(),
  })

  public messages = {}
}
