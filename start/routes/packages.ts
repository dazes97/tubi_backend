import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
  Route.get('package', 'PackagesController.index').middleware('checkCompanyOwner')
  Route.get('package/packagesInBranch', 'PackagesController.listPackagesInBranch').middleware(
    'checkPersonal'
  )
  Route.post('package', 'PackagesController.store').middleware('checkCompanyOwner')
  Route.put('package/:id', 'PackagesController.update').middleware('checkCompanyOwner')
  Route.delete('package/:id', 'PackagesController.destroy').middleware('checkCompanyOwner')
}).middleware(['auth', 'checkCompanyStatus'])

// Route.resource('service', 'ServicesController')
//   .apiOnly()
//   .middleware({
//     index: ['auth', 'checkCompanyStatus'],
//     store: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     update: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     destroy: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//   })
