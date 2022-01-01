import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('', 'bot/BotsController.index')
  Route.post('tracking', 'bot/BotsController.getTracking')
  Route.post('getCompanies', 'bot/BotsController.getCompanies')
  Route.post('getBranchesByCompany', 'bot/BotsController.getBranchesByCompany')
  Route.post('getServicesByBranch', 'bot/BotsController.getServicesByBranch')
}).prefix('/api/bot')
