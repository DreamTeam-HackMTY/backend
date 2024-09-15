import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/Users/User'
import View from '@ioc:Adonis/Core/View'
import Env from '@ioc:Adonis/Core/Env'
import mjml from 'mjml'

enum Options {
  'emails/Passwords/view_password',
}

type ViewOptions = keyof typeof Options

export default class SenderMail extends BaseMailer {
  private user: User
  private subject: string
  private data: Record<string, any>
  private view: ViewOptions

  constructor({
    user,
    subject,
    data,
    view,
  }: {
    user: User
    subject: string
    data: Record<string, any>
    view: ViewOptions
  }) {
    super()
    this.user = user
    this.subject = subject
    this.data = data
    this.view = view
  }

  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  public mailer = this.mail.use('smtp')

  /**
   * The prepare method is invoked automatically when you run
   * "SenderMail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    const render = await View.render(this.view, {
      ...this.data,
      user: this.user,
    })

    const viewMjml = mjml(render)

    message
      .from(Env.get('SMTP_USERNAME'))
      .to(this.user.email)
      .subject(this.subject)
      .html(viewMjml.html)
  }
}
