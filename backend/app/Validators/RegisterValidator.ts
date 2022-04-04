import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.required()]),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({}, [rules.minLength(5), rules.maxLength(20)]),
    passwordConfirm: schema.string({}, [rules.minLength(5), rules.maxLength(20)]),
  })

  public messages = {
    'required': 'O {{ field }} é obrigatório para criar um novo usuário',
    'email.unique': 'Já existe um usuário cadastrado com o e-mail informado',
    'passwordConfirm.required': 'É necessário confirmar a senha escolhida',
  }
}
