import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BotsController {
  public async index({ request, response }: HttpContextContract) {
    console.log('request: ', JSON.stringify(request.all()))
    response.ok({
      fulfillmentMessages: [
        {
          text: {
            text: ['Saludos desde adonis'],
          },
        },
      ],
    })
  }
}
