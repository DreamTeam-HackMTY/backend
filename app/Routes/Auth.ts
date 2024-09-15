import Route from '@ioc:Adonis/Core/Route'

//Auth
Route.group(() => {
  Route.group(() => {
    Route.get('me', 'AuthController.me')
    Route.post('logout', 'AuthController.logout')
  }).middleware('auth')

  Route.post('login', 'AuthController.login')
})
  .namespace('App/Controllers/Http/Auth')
  .prefix('api/v1/auth')
