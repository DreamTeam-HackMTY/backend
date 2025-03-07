import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Users/Role'
import User from 'App/Models/Users/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const [DEV, ADMIN, ESPECIALISTA, INVITADO] = await Role.createMany([
      {
        name: 'DEV',
        active: true,
      },
      {
        name: 'ADMIN',
        active: true,
      },
      {
        name: 'ESPECIALISTA',
        active: true,
      },
      {
        name: 'INVITADO',
        active: true,
      },
    ])

    const [dev, admin, especialista, guest] = await User.createMany([
      {
        email: 'dev@example.com',
        username: 'dev',
        password: 'dev.pass',
        active: true,
      },
      {
        email: 'admin@example.com',
        username: 'admin',
        password: 'admin.pass',
        active: true,
      },
      {
        email: 'especialista@example.com',
        username: 'especialista',
        password: 'especialista.pass',
        active: true,
      },
      {
        email: 'guest@example.com',
        username: 'guest',
        password: 'guest.pass',
        active: true,
      },
    ])

    await dev.related('roles').attach([DEV.id])
    await admin.related('roles').attach([ADMIN.id])
    await especialista.related('roles').attach([ESPECIALISTA.id])
    await guest.related('roles').attach([INVITADO.id])
  }
}
