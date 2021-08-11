import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export default class CompaniesController {
  public async index({ response }: HttpContextContract) {
    try {
      const companies = await Company.all()
      return response.ok({ data: companies })
    } catch (e) {
      console.log('companiesController.index:', e)
      return response.internalServerError()
    }
  }
  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {
      const company = await Company.create(request.body())
      return response.ok({ data: company })
    } catch (e) {
      console.log('CompanyController.store: ', e)
      return response.internalServerError()
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const company = await Company.findOrFail(id)
      const updatedCompany = await company.merge(request.body()).save()
      return response.ok({ data: updatedCompany })
    } catch (e) {
      console.log('PersonalTypeController.update: ', e)
      return response.internalServerError()
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const company = await Company.findOrFail(id)
      const deletedCompany = await company.delete()
      return response.ok({ data: deletedCompany })
    } catch (e) {
      console.log('CompanyController.destroy: ', e)
      return response.internalServerError()
    }
  }
}
