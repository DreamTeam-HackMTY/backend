import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import ApiToken from 'App/Models/Auth/ApiToken'
import User from 'App/Models/Users/User'
import AuthValidator from 'App/Validators/Auth/AuthValidator'

export default class AuthController {
  public async login(ctx: HttpContextContract) {
    const { auth, request, response } = ctx

    const apiAuth = auth.use('api')

    // Validar datos de entrada
    try {
      await request.validate(AuthValidator)
    } catch (error) {
      return ValidatorException({ Response: response, Err: error })
    }

    const { email, password } = request.only(['email', 'password'])

    // Verificar credenciales
    try {
      await apiAuth.verifyCredentials(email, password)
    } catch (error) {
      return response.badRequest({
        status: 'Error',
        message: 'Credenciales incorrectas',
        data: null,
      })
    }

    const user = await User.query().preload('roles').where({ email }).first()

    if (!user || !user.active) {
      return response.notFound({
        status: 'Error',
        message: 'Usuario no encontrado',
        data: null,
      })
    }

    // Verificar sesion activa
    if (user.rememberMeToken) {
      await ApiToken.setApiTokenInRequest({
        token: user.rememberMeToken,
        apiRequest: request,
      })

      const isValidToken = await apiAuth.check()

      if (isValidToken) {
        const expires_at = await ApiToken.formatExpiresAt({
          tokenHash: apiAuth.token?.tokenHash,
        })

        return response.ok({
          status: 'Éxito',
          message: 'Ya existe una sesión activa',
          data: {
            type: 'bearer',
            token: user.rememberMeToken,
            expiresAt: expires_at,
          },
        })
      }

      await ApiToken.revokeApiToken({ currentUser: user })
    }

    const apiAuthAttempt = await apiAuth.attempt(email, password, {
      expiresIn: '30 days',
    })

    const apiToken = await ApiToken.getApiToken({
      authAttempt: apiAuthAttempt,
      currentUser: user,
    })

    return response.ok({
      status: 'Éxito',
      message: 'Inicio de sesión éxitoso',
      data: apiToken,
    })
  }

  public async logout({ auth, response }: HttpContextContract) {
    const { user } = auth.use('api') as any

    const user_model = await User.find(user?.id)

    const revoked = await ApiToken.revokeApiToken({
      currentUser: user_model as User,
    })

    return response.ok({
      status: 'Éxito',
      message: 'Sesiones cerradas éxitosamente',
      data: {
        tokensRevoked: revoked,
      },
    })
  }

  public async me({ auth, response }: HttpContextContract) {
    const { user } = auth.use('api')

    const user_model = await User.query()
      .where({ id: user?.id })
      .preload('roles')
      .first()

    return response.ok({
      status: 'Éxito',
      message: 'Datos del usuario actual',
      data: user_model as User,
    })
  }
}
