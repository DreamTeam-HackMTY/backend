import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateCaseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    disease_id: schema.number.optional([
      rules.exists({ table: 'diseases', column: 'id' }),
    ]),
    state_id: schema.number.optional([
      rules.exists({ table: 'states', column: 'id' }),
    ]),
    quantity: schema.number.optional(),
    is_deaths: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    required: `El campo '{{ field }}' es requerido`,
    exists: `El campo '{{ field }}' no encontro el elemento en la base de datos`,
    '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
  }
}
