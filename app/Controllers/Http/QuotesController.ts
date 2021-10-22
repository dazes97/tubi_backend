import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Quote from 'App/Models/Quote'

export default class QuotesController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const requests = await Quote.getQuotePerBranch(auth.user?.id)
      response.ok({ data: requests })
    } catch (e) {
      console.log('RequestsController.index: ', e)
      response.internalServerError()
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const quoteCreated = Quote.createQuote(auth.user?.id, request.body())
      response.ok({ data: quoteCreated })
    } catch (e) {
      console.log('QuotesController.store: ', e)
      response.internalServerError()
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const quoteUpdated = Quote.updateQuoteStatus(auth.user?.id, request.body())
      response.ok({ data: quoteUpdated })
    } catch (e) {
      console.log('QuotesCOntroller.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({}: HttpContextContract) {}
}
