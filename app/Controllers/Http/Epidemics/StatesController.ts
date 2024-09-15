import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State from 'App/Models/Epidemic/State'

export default class StatesController {
  public async index({ response }: HttpContextContract) {
    const states = await State.all()

    return response.ok({
      status: 'Éxito',
      message: 'Estados obtenidos',
      data: states,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const state = await State.find(params.id)

    if (!state) {
      return response.notFound({
        status: 'Error',
        message: 'Estado no encontrado',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Estado obtenido',
      data: state,
    })
  }
}
