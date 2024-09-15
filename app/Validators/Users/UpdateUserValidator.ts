import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string.optional({ trim: true }, [
      rules.email(),
      rules.maxLength(80),
    ]),
    username: schema.string.optional({ trim: true }, [rules.maxLength(75)]),
    role_id: schema.number.optional([
      rules.unsigned(),
      rules.exists({ table: 'roles', column: 'id' }),
    ]),
  })

  public messages: CustomMessages = {
    required: `El campo '{{ field }}' es requerido`,
    email: 'Formato de email no valido',
    unique: 'El email ingresado ya existe',
    maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
    mobile: `El formato del campo '{{ field }}' debe ser: +52 -> México`,
    exists: `El dato por '{{ field }}' no fue encontrado`,
    requiredWhen: `El campo '{{ field }}' es requerido`,
    '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
  }
}
