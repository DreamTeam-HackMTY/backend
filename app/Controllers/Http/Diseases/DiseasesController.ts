import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Diseases from 'App/Models/Epidemic/Disease';
import Database from '@ioc:Adonis/Lucid/Database'
import CreateDiseaseValidator from 'App/Validators/Diseases/CreateDiseaseValidator'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import UpdateDiseasesValidator from 'App/Validators/Diseases/UpdateDiseaseValidator'

export default class DiseasesController {
  public async index({ response }: HttpContextContract) {
    const diseases = await Diseases.query().orderBy('id', 'desc')

    return response.ok({
      status: 'Éxito',
      message: 'Enfermedades obtenidas',
      data: diseases,
    })
  }

  public async store({ response, request }: HttpContextContract) {

    try {
      await request.validate(CreateDiseaseValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

    const data = request.only(['name', 'description'])

    const disease = new Diseases()
    disease.name = data.name
    disease.description = data.description
    disease.active = true

    const trx = await Database.transaction()

    try {
      await disease.useTransaction(trx).save()
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

  public async show({ params, response }: HttpContextContract) {
    const disease = await Diseases.find(params.id)

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
      data: await disease,
    })
  }

  public async update({ request, response, params }: HttpContextContract) {
    const data = request.only(['name', 'description'])
    const disease = await Diseases.find(params.id)

    try {
      await request.validate(UpdateDiseasesValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

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
      await disease.useTransaction(trx).merge({ active: !disease.active }).save()
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
      data: disease
    })
  }
}