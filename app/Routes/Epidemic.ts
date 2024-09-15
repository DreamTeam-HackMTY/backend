import Route from '@ioc:Adonis/Core/Route'

// Diseases
Route.group(() => {
  Route.resource('diseases', 'DiseasesController').apiOnly()
  Route.resource('states', 'StatesController').only(['index', 'show'])
  Route.resource('cases', 'CasesController').apiOnly()
})
  .namespace('App/Controllers/Http/Epidemics')
  .prefix('api/v1')
  .middleware('auth')
