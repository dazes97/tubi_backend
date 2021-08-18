import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export default class CompaniesController {
  public async index({ response }: HttpContextContract) {
    try {
      const companies = await Company.all()
      response.ok({ data: companies })
    } catch (e) {
      console.log('companiesController.index:', e)
      response.internalServerError()
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const company = await Company.create(request.body())
      response.ok({ data: company })
    } catch (e) {
      console.log('CompanyController.store: ', e)
      response.internalServerError()
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const company = await Company.findOrFail(id)
      const updatedCompany = await company.merge(request.body()).save()
      response.ok({ data: updatedCompany })
    } catch (e) {
      console.log('PersonalTypeController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const company = await Company.findOrFail(id)
      const deletedCompany = await company.delete()
      response.ok({ data: deletedCompany })
    } catch (e) {
      console.log('CompanyController.destroy: ', e)
      response.internalServerError()
    }
  }
}
