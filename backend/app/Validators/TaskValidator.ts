import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    todo_id: schema.number([rules.required(), rules.exists({ table: 'todos', column: 'todo_id' })]),
    parent_id: schema.number.nullableAndOptional([]),
    name: schema.string({}, [rules.required()]),
    deadline: schema.date({}, [rules.required()]),
  })

  public messages = {}
}
