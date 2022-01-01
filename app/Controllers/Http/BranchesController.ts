import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Branch from 'App/Models/Branch'
import Personal from 'App/Models/Personal'
export default class BranchesController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const branches = await Branch.getBranchPerCompany(auth.user?.id)
      response.ok({ data: branches })
    } catch (e) {
      console.log('BranchesController.index: ', e)
      response.internalServerError()
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const branchCreated = await Branch.create({ ...request.body(), companyId })
      response.ok({ data: branchCreated })
    } catch (e) {
      console.log('BranchesController.store: ', e)
      response.internalServerError()
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const branchUpdated = await Branch.updateBranch(
        request.body(),
        auth.user?.id,
        request.param('id')
      )
      response.ok({ data: branchUpdated })
    } catch (e) {
      console.log('BranchesController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    try {
      const branchDeleted = await Branch.deleteBranch(request.param('id'), auth.user?.id)
      response.ok({ data: { branchDeleted } })
    } catch (e) {
      console.log('BranchesController.destroy: ', e)
      response.internalServerError()
    }
  }
}
