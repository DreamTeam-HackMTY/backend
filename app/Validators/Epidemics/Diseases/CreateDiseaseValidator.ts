import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDiseaseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(80),
    ]),
    description: schema.string({ trim: true }, [rules.required()]),
  })

  public messages: CustomMessages = {
    required: `El campo '{{ field }}' es requerido`,
    maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
    '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
  }
}
