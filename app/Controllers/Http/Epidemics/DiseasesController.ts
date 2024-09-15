import CreateDiseaseValidator from 'App/Validators/Epidemics/Diseases/CreateDiseaseValidator'
import UpdateDiseasesValidator from 'App/Validators/Epidemics/Diseases/UpdateDiseaseValidator'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Diseases from 'App/Models/Epidemic/Disease'
import Database from '@ioc:Adonis/Lucid/Database'

export default class DiseasesController {
  private diseases = Diseases.query().preload('cases').orderBy('id', 'desc')

  public async index({ response }: HttpContextContract) {
    return response.ok({
      status: 'Éxito',
      message: 'Enfermedades obtenidas',
      data: await this.diseases,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const disease = await this.diseases.where('id', params.id).first()

    if (!disease) {
      return response.notFound({
        status: 'Error',
        message: 'Enfermedad no encontrada',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Enfermedad obtenida',
      data: disease,
    })
  }

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      await request.validate(CreateDiseaseValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

    const data = request.only(['name', 'description'])

    let disease: Diseases

    const trx = await Database.transaction()

    try {
      disease = await Diseases.create({
        ...data,
        active: true,
      })

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      return response.internalServerError({
        status: 'Error',
        message: 'Error al guardar la enfermedad',
        data: null,
      })
    }

    return response.created({
      status: 'Éxito',
      message: 'Enfermedad creada',
      data: disease,
    })
  }

  public async update(ctx: HttpContextContract) {
    const { request, response, params } = ctx

    try {
      await request.validate(UpdateDiseasesValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

    const data = request.only(['name', 'description'])

    const disease = await Diseases.find(params.id)

    if (!disease) {
      return response.notFound({
        status: 'Error',
        message: 'Enfermedad no encontrada',
        data: null,
      })
    }

    const trx = await Database.transaction()

    try {
      await disease.useTransaction(trx).merge(data).save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      return response.internalServerError({
        status: 'Error',
        message: 'Error al actualizar la enfermedad',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Enfermedad actualizada',
      data: disease,
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const disease = await Diseases.find(params.id)

    if (!disease) {
      return response.notFound({
        status: 'Error',
        message: 'Enfermedad no encontrada',
        data: null,
      })
    }

    const trx = await Database.transaction()

    try {
      await disease
        .useTransaction(trx)
        .merge({ active: !disease.active })
        .save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      return response.internalServerError({
        status: 'Error',
        message: 'Error al eliminar la enfermedad',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Enfermedad eliminada',
      data: disease,
    })
  }
}
