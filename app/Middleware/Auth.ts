import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthMiddleware {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    const apiAuth = auth.use('api')

    const isAuth = await apiAuth.check()

    if (!isAuth) {
      const { isAuthenticated } = auth.use('api')

      return response.unauthorized({
        status: 'Error',
        message: 'Sesión expirada o token inválido',
        data: {
          isAuthenticated,
        },
      })
    }

    await next()
  }
}
