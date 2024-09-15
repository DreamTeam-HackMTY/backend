import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Roles from 'App/Models/Users/Role';

export default class RolesController {
  public async index({ response }: HttpContextContract) {
    return response.ok({
      status: 'Éxito',
      message: 'Roles obtenidos',
      data: await Roles.all(),
    })
  }

  public async store({}: HttpContextContract) {}

  public async show({ params, response }: HttpContextContract) {
    const role = await Roles.find(params.id)

    if (!role) {
      return response.notFound({
        status: 'Error',
        message: 'Rol no encontrado',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Rol obtenido',
      data: await role,
    })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
