import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
export default class CompanyOwnersController {
  public async index({ response }: HttpContextContract) {
    try {
      const companyOwners = await Personal.query()
        .where('personalTypeId', 1)
        .preload('user')
        .preload('personalType')
        .preload('company')
      response.ok({ data: companyOwners })
    } catch (e) {
      console.log('CompanyOwnersController.index: ', e)
      response.internalServerError()
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const companyOwner = await Personal.createCompanyOwner(request.body())
      response.ok(companyOwner)
    } catch (e) {
      console.log('CompanyOwnersController.store: ', e)
      response.internalServerError()
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const companyOwner = await Personal.updateCompanyOwner(request.body(), id)
      response.ok({ data: companyOwner })
    } catch (e) {
      console.log('CompanyOwnersController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    try {
      const id = request.param('id')
      const companyOwner = await Personal.findOrFail(id)
      const deletedCompanyOwner = await companyOwner.delete()
      response.ok({ data: deletedCompanyOwner })
    } catch (e) {
      console.log('CompanyOwnersController.destroy: ', e)
      response.internalServerError()
    }
  }
}
