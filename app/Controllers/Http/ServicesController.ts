import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import Service from 'App/Models/Service'
import SERVICE_TYPE from 'App/utils/serviceType'
export default class ServicesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const services = await Service.listServicesByCompany(auth.user?.id, SERVICE_TYPE.SERVICE)
      response.ok({ data: services })
    } catch (e) {
      console.log('ServicesController.index: ', e)
      response.internalServerError()
    }
  }
  public async listServicesInBranch({ auth, response }: HttpContextContract) {
    try {
      const services = await Service.listServicesInBranch(auth.user?.id, SERVICE_TYPE.SERVICE)
      response.ok({ data: services })
    } catch (e) {
      console.log('ServicesController.listServicesInBranch: ', e)
      response.internalServerError()
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const serviceCreated = await Service.create({
        ...request.body(),
        companyId,
        type: SERVICE_TYPE.SERVICE,
      })
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
