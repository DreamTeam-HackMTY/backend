import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State from 'App/Models/Epidemic/State'

export default class StatesController {
  private states = State.query().where({ active: true }).orderBy('id', 'desc')

  public async index({ request, response }: HttpContextContract) {
    const { disease_id } = request.qs()

    if (disease_id) {
      const disease_id_number = parseInt(disease_id)

      if (isNaN(disease_id_number)) {
        return response.badRequest({
          status: 'Error',
          message: 'El ID de la enfermedad debe ser un número',
          data: null,
        })
      }

      const states_list = await this.states.preload('cases', (casesQuery) => {
        casesQuery.preload('disease').where('disease_id', disease_id)
      })

      const result = states_list.map((state) => {
        const totalCases = state.cases.reduce(
          (sum, _case) => sum + _case.quantity,
          0,
        )

        const deaths = state.cases
          .filter((_case) => _case.is_deaths)
          .reduce((sum, _case) => sum + _case.quantity, 0)

        const { cases, ...state_data } = state.toJSON()

        return {
          ...state_data,
          total_cases: totalCases,
          deaths: deaths,
        }
      })

      return response.ok({
        status: 'Éxito',
        message: 'Estados obtenidos',
        data: result,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Estados obtenidos',
      data: await this.states,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const state = await this.states.where('id', params.id).first()

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
