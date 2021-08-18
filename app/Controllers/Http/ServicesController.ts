import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import Service from 'App/Models/Service'

export default class ServicesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const services = await Service.query()
        .where('companyId', companyId)
        .orderBy('createdAt', 'desc')
      response.ok({ data: services })
    } catch (e) {
      console.log('ServicesController.index: ', e)
      response.internalServerError()
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const serviceCreated = await Service.create({ ...request.body(), companyId })
      response.ok({ data: serviceCreated })
    } catch (e) {
      console.log('ServicesController.store: ', e)
      response.internalServerError()
    }
  }

  public async update({ request, auth, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const service = await Service.findServiceByCompany(id, companyId)
      const updatedData = await service.merge(request.body()).save()
      response.ok({ data: updatedData })
    } catch (e) {
      console.log('ServicesController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    try {
      const id = request.param('id')
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const service = await Service.findServiceByCompany(id, companyId)
      const serviceDeleted = await service.delete()
      response.ok({ data: serviceDeleted })
    } catch (e) {
      console.log('ServicesController.destroy: ', e)
      response.internalServerError()
    }
  }
}
