import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import Case from 'App/Models/Epidemic/Case'
import State from 'App/Models/Epidemic/State'
import CreateCaseValidator from 'App/Validators/Epidemics/Cases/CreateCaseValidator'

export default class CasesController {
  private cases = Case.query()
    .preload('disease')
    .preload('state')
    .orderBy('created_at', 'desc')

  public async index({ response }: HttpContextContract) {
    return response.ok({
      status: 'Éxito',
      message: 'Casos de enfermedades en estados',
      data: await this.cases,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const _case = await this.cases.where('id', params.id).first()

    if (!_case) {
      return response.notFound({
        status: 'Error',
        message: 'Caso no encontrado',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Caso encontrado',
      data: _case,
    })
  }

  public async showStateByDisease({ params, response }: HttpContextContract) {
    // Consulta para agrupar y sumar las cantidades
    const cases = await Database
      .from('cases')
      .where('disease_id', params.diseaseId)
      .select('state_id')
      .sum('quantity as total_quantity')
      .groupBy('state_id')
      .orderBy('total_quantity', 'desc')

    if (cases.length === 0) {
      return response.notFound({
        status: 'Error',
        message: 'Casos no encontrados',
        data: null,
      })
    }

    // Obtener los nombres de los estados
    const stateIds = cases.map((_case) => _case.state_id)
    const states = await State.query().whereIn('id', stateIds)

    // Formatear la respuesta
    const formattedCases = cases.map((_case) => {
      const state = states.find((state) => state.id === _case.state_id)
      return {
        state: {
          id: _case.state_id,
          name: state ? state.name : 'Desconocido',
        },
        total_quantity: _case.total_quantity,
      }
    })

    return response.ok({
      status: 'Éxito',
      message: 'Casos encontrados',
      data: formattedCases,
    })
  }

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      await request.validate(CreateCaseValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

    const data = request.only([
      'disease_id',
      'state_id',
      'quantity',
      'is_deaths',
    ])

    let _case: Case

    const trx = await Database.transaction()

    try {
      _case = await Case.create({ ...data, active: true }, { client: trx })

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      console.error(error)

      return response.internalServerError({
        status: 'Error',
        message: 'No se pudo crear el caso',
        data: null,
      })
    }

    return response.created({
      status: 'Éxito',
      message: 'Caso creado',
      data: _case,
    })
  }

  public async update(ctx: HttpContextContract) {
    const { params, request, response } = ctx

    try {
      await request.validate(CreateCaseValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

    const data = request.only([
      'disease_id',
      'state_id',
      'quantity',
      'is_deaths',
    ])

    const _case = await Case.find(params.id)

    if (!_case) {
      return response.notFound({
        status: 'Error',
        message: 'Caso no encontrado',
        data: null,
      })
    }

    const trx = await Database.transaction()

    try {
      await _case.useTransaction(trx).merge(data).save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      return response.badRequest({
        status: 'Error',
        message: 'No se pudo actualizar el caso',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Caso actualizado',
      data: _case,
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const _case = await Case.find(params.id)

    if (!_case) {
      return response.notFound({
        status: 'Error',
        message: 'Caso no encontrado',
        data: null,
      })
    }

    const trx = await Database.transaction()

    try {
      await _case.useTransaction(trx).merge({ active: !_case.active }).save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      return response.badRequest({
        status: 'Error',
        message: 'No se pudo eliminar el caso',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: `Caso ${_case.active ? 'eliminado' : 'restaurado'}`,
      data: _case,
    })
  }
}
