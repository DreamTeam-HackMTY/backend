import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.maxLength(80),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),
    username: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(75),
    ]),
    role_id: schema.number([
      rules.required(),
      rules.unsigned(),
      rules.exists({ table: 'roles', column: 'id' }),
    ]),
  })

  public messages: CustomMessages = {
    required: `El campo '{{ field }}' es requerido`,
    email: 'Formato de email no valido',
    unique: 'El email ingresado ya existe',
    maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
    '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
  }
}
