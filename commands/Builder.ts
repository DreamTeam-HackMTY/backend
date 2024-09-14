import { BaseCommand } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import execa from 'execa'

export default class Builder extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'builder'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Custom command to compile the application from Typescript to Javascript.'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    if (Env.get('NODE_ENV') !== 'development') {
      this.logger.error('This command can only be run in development mode')
      await this.exit()
    }

    this.logger.info('Compiling the application...')

    try {
      await execa.node('ace', ['type-check'], {
        stdio: 'inherit',
      })
    } catch (error) {
      this.logger.error(error)

      process.exit(1)
    }

    try {
      await execa.node('ace', ['build', '--production'], {
        stdio: 'inherit',
      })
    } catch (error) {
      this.logger.error(error)

      process.exit(1)
    }

    this.logger.success('Application compiled successfully')
  }
}
