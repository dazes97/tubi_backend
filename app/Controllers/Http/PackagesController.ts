import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from 'App/Models/Service'
import SERVICE_TYPE from 'App/utils/serviceType'

export default class PackagesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const packages = await Service.listServicesByCompany(auth.user?.id, SERVICE_TYPE.PACKAGE)
      response.ok({ data: packages })
    } catch (e) {
      console.log('PackagesController,index: ', e)
      response.internalServerError()
    }
  }
  public async listPackagesInBranch({ auth, response }: HttpContextContract) {
    try {
      const packages = await Service.listServicesInBranch(auth.user?.id, SERVICE_TYPE.PACKAGE)
      response.ok({ data: packages })
    } catch (e) {
      console.log('PackagesController.listPackagesInBranch: ', e)
      response.internalServerError()
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const packageCreated = await Service.createPackage(request.body(), auth.user?.id)
      response.ok({ data: packageCreated })
    } catch (e) {
      console.log('PackagesController.store: ', e)
      response.internalServerError()
    }
  }

  public async update({ request, auth, response }: HttpContextContract) {
    try {
      const packageUpdated = await Service.updatePackage(request.body(), auth.user?.id)
      response.ok({ data: { packageUpdated } })
    } catch (e) {
      console.log('PackageController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    try {
      const packageDeleted = await Service.deletePackage(request.param('id'), auth.user?.id)
      response.ok({ data: { packageDeleted } })
    } catch (e) {
      console.log('PackageController.destroy: ', e)
      response.internalServerError()
    }
  }
}
