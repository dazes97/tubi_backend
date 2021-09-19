import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Request from 'App/Models/Request'

export default class RequestsController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const requests = await Request.getRequestPerBranch(auth.user?.id)
      response.ok({ data: requests })
    } catch (e) {
      console.log('RequestsController.index: ', e)
      response.internalServerError()
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const requestCreated = Request.createRequest(auth.user?.id, request.body())
      response.ok({ data: requestCreated })
    } catch (e) {
      console.log('RequestsController.store: ', e)
      response.internalServerError()
    }
  }
  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const requestUpdated = Request.updateRequestStatus(auth.user?.id, request.body())
      response.ok({ data: requestUpdated })
    } catch (e) {
      console.log('RequestsController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({}: HttpContextContract) {}
}
