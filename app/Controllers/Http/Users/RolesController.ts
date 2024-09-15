import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Roles from 'App/Models/Users/Role'

export default class RolesController {
  public async index({ response }: HttpContextContract) {
    const roles = await Roles.query()
      .where({ active: true })
      .orderBy('id', 'desc')

    return response.ok({
      status: 'Éxito',
      message: 'Roles obtenidos',
      data: roles,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const role = await Roles.find(params.id)

    if (!role || !role.active) {
      return response.notFound({
        status: 'Error',
        message: 'Rol no encontrado',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Rol obtenido',
      data: role,
    })
  }
}
