import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogRequest {
  public async handle(
    { request, logger }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    logger.info(`${request.method()} => ${request.url()}`)

    await next()
  }
}
