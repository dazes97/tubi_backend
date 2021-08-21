import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Package from 'App/Models/Package'
import Personal from 'App/Models/Personal'

export default class PackagesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const packages = await Package.query().preload('services').where('companyId', companyId)
      response.ok({ data: packages })
    } catch (e) {
      console.log('PackagesController,index: ', e)
      response.internalServerError()
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const packageCreated = await Package.createPackage(request.body(), auth.user?.id)
      response.ok({ data: packageCreated })
    } catch (e) {
      console.log('PackagesController.store: ', e)
      response.internalServerError()
    }
  }

  public async update({ request, auth, response }: HttpContextContract) {
    try {
      const packageUpdated = await Package.updatePackage(request.body(), auth.user?.id)
      response.ok({ data: { packageUpdated } })
    } catch (e) {
      console.log('PackageController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    try {
      const packageDeleted = await Package.deletePackage(request.param('id'), auth.user?.id)
      response.ok({ data: { packageDeleted } })
    } catch (e) {
      console.log('PackageController.destroy: ', e)
      response.internalServerError()
    }
  }
}
