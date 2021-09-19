import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
  Route.get('service', 'ServicesController.index').middleware('checkCompanyOwner')
  Route.get('service/servicesInBranch', 'ServicesController.listServicesInBranch').middleware(
    'checkPersonal'
  )
  Route.post('service', 'ServicesController.store').middleware('checkCompanyOwner')
  Route.put('service/:id', 'ServicesController.update').middleware('checkCompanyOwner')
  Route.delete('service/:id', 'ServicesController.destroy').middleware('checkCompanyOwner')
}).middleware(['auth', 'checkCompanyStatus'])

// Route.resource('service', 'ServicesController')
//   .apiOnly()
//   .middleware({
//     index: ['auth', 'checkCompanyStatus'],
//     store: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     update: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     destroy: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//   })
