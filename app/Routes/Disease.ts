import Route from '@ioc:Adonis/Core/Route'

// Diseases
Route.group(() => {
  Route.resource('diseases', 'DiseasesController').apiOnly()
})
  .namespace('App/Controllers/Http/Diseases')
  .prefix('api/v1')
  .middleware('auth')