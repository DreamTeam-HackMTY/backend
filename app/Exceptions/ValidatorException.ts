import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export function ValidatorException({
  Err,
  Response,
}: {
  Err: any
  Response: HttpContextContract['response']
}) {
  const BAD_REQUEST = 400
  const NOT_FOUND = 404
  const RULE_EXIST = 'exists'

  // Destructuring
  const {
    messages: {
      errors: [{ message, field, rule }],
    },
  } = Err

  if (Env.get('NODE_ENV') == 'development') {
    console.log('Err', Err.messages)
  }

  return Response.status(
    rule.includes(RULE_EXIST) ? NOT_FOUND : BAD_REQUEST
  ).json({
    status: 'Error',
    message,
    data: {
      field,
      rule,
    },
  })
}
