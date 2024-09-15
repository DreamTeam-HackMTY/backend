import CreateUserValidator from 'App/Validators/Users/CreateUserValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import CodeGenerator from 'App/Services/CodeGenerator'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/Users/User'
import SenderMail from 'App/Mailers/SenderMail'
import UpdateUserValidator from 'App/Validators/Users/UpdateUserValidator'
import Sanitizer from 'App/Services/Sanitizer'

export default class UsersController {
  private users = User.query().preload('roles').orderBy('id', 'desc')

  public async index({ response }: HttpContextContract) {
    return response.ok({
      status: 'Éxito',
      message: 'Usuarios obtenidos',
      data: await this.users,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const user = await this.users.where('id', params.id).first()

    if (!user) {
      return response.notFound({
        status: 'Error',
        message: 'Usuario no encontrado',
        data: null,
      })
    }

    return response.ok({
      status: 'Éxito',
      message: 'Usuario obtenido',
      data: user,
    })
  }

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      await request.validate(CreateUserValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

    const { role_id, ...data_user } = request.only([
      'email',
      'username',
      'role_id',
    ])

    const { code } = CodeGenerator.codeGenerator({
      length: 15,
      type: 'string',
    })

    let user: User

    const trx = await Database.transaction()

    try {
      user = await User.create(
        { ...data_user, password: code, active: true },
        { client: trx },
      )

      await user.related('roles').attach([role_id], trx)

      const sender_mail = new SenderMail({
        user,
        subject: `Bienvenido a Epidemidata, ${user.username}`,
        view: 'emails/Passwords/view_password',
        data: {
          title: 'Bienvenido a Epidemidata.',
          password: code,
        },
      })

      await sender_mail.send()

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      Logger.error(error)

      return response.internalServerError({
        status: 'Error',
        message: 'Error al crear usuario o enviar el correo',
        data: null,
      })
    }

    return response.created({
      status: 'Éxito',
      message: 'Usuario creado',
      data: user,
    })
  }

  public async update(ctx: HttpContextContract) {
    const { params, request, response } = ctx

    try {
      await request.validate(UpdateUserValidator)
    } catch (error) {
      return ValidatorException({ Err: error, Response: response })
    }

    const { role_id, ...user_data } = Sanitizer.filter({
      data: request.only(['email', 'username', 'role_id']),
      removeNullAndUndefined: true,
    })

    const user = await User.query().where({ id: params.id }).first()

    if (!user) {
      return response.notFound({
        status: 'Error',
        message: 'Usuario no encontrado',
        data: null,
      })
    }

    if (user_data.email) {
      const existEmail = await User.query()
        .where({ email: user_data.email })
        .whereNot({ id: user.id })
        .first()

      if (existEmail) {
        return response.badRequest({
          status: 'Error',
          message: 'El email ingresado ya existe',
          data: null,
        })
      }
    }

    const trx = await Database.transaction()

    try {
      user.useTransaction(trx)

      await user.merge(user_data).save()

      if (role_id) {
        await user.related('roles').sync([role_id])
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      Logger.error(error)

      return response.internalServerError({
        status: 'Error',
        message: 'Error al actualizar usuario',
        data: null,
      })
    }

    const user_updated = await this.users.where({ id: user.id }).first()

    return response.ok({
      status: 'Éxito',
      message: 'Usuario actualizado',
      data: user_updated,
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        status: 'Error',
        message: 'Usuario no encontrado',
        data: null,
      })
    }

    const trx = await Database.transaction()

    try {
      user.useTransaction(trx)

      await user.merge({ active: !user.active }).save()

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      Logger.error(error)

      return response.internalServerError({
        status: 'Error',
        message: 'Error al desactivar/activar usuario',
        data: null,
      })
    }

    const user_desactivated = await this.users.where({ id: user.id }).first()

    return response.ok({
      status: 'Éxito',
      message: `Usuario ${user.active ? 'activado' : 'desactivado'}`,
      data: user_desactivated,
    })
  }
}
