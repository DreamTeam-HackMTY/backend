import Route from '@ioc:Adonis/Core/Route'

//Users and Roles
Route.group(() => {
  Route.resource('users', 'UsersController').apiOnly()
  Route.resource('roles', 'RolesController').apiOnly()
})
  .namespace('App/Controllers/Http/Users')
  .prefix('api/v1')
  .middleware('auth')
