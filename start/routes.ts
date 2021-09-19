/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Route from '@ioc:Adonis/Core/Route'
import './routes/services'
import './routes/packages'

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.resource('companyOwner', 'CompanyOwnersController')
  .apiOnly()
  .middleware({
    index: ['auth', 'checkAdmin'],
    store: ['auth', 'checkAdmin'],
    update: ['auth', 'checkAdmin'],
    destroy: ['auth', 'checkAdmin'],
  })
Route.resource('company', 'CompaniesController')
  .apiOnly()
  .middleware({
    index: ['auth', 'checkAdmin'],
    store: ['auth', 'checkAdmin'],
    update: ['auth', 'checkAdmin'],
    destroy: ['auth', 'checkAdmin'],
  })
Route.resource('personalType', 'PersonalTypesController')
  .apiOnly()
  .middleware({
    index: ['auth', 'checkCompanyStatus'],
    store: ['auth', 'checkAdmin'],
    update: ['auth', 'checkAdmin'],
    destroy: ['auth', 'checkAdmin'],
  })
Route.resource('request', 'RequestsController')
  .apiOnly()
  .middleware({
    index: ['auth', 'checkCompanyStatus', 'checkPersonal'],
    store: ['auth', 'checkCompanyStatus', 'checkPersonal'],
    update: ['auth', 'checkCompanyStatus', 'checkPersonal'],
    destroy: ['auth', 'checkCompanyStatus', 'checkPersonal'],
  })
Route.resource('branch', 'BranchesController')
  .apiOnly()
  .middleware({
    index: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
    store: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
    update: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
    destroy: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
  })
Route.resource('personal', 'PersonalsController')
  .apiOnly()
  .middleware({
    index: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
    store: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
    update: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
    destroy: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
  })
// Route.resource('service', 'ServicesController')
//   .apiOnly()
//   .middleware({
//     index: ['auth', 'checkCompanyStatus'],
//     store: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     update: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     destroy: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//   })
// Route.resource('package', 'PackagesController')
//   .apiOnly()
//   .middleware({
//     index: ['auth', 'checkCompanyStatus'],
//     store: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     update: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//     destroy: ['auth', 'checkCompanyStatus', 'checkCompanyOwner'],
//   })
Route.post('login', 'AuthController.auth')
Route.post('logout', 'AuthController.logout')
