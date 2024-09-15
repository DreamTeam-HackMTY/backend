import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(80),
      rules.email(),
    ]),
    password: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(15),
    ]),
  })

  public messages: CustomMessages = {
    required: `El campo '{{ field }}' es requerido`,
    email: `El formato del campo '{{ field }}' no es valido`,
    maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
    '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
  }
}
