import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
export default class PersonalsController {
  public async index({ response }: HttpContextContract) {
    try {
      const personals = await Personal.query().preload('user').preload('personalType')
      return response.ok({ data: personals })
    } catch (e) {
      console.log('index Personal: ', e)
      return response.internalServerError()
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const personal = await Personal.createPersonal(request.body(), auth.user)
      return response.ok(personal)
    } catch (e) {
      console.log('store Personal: ', e)
      return response.internalServerError()
    }
  }
  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const personal = await Personal.updatePersonal(request.body(), id)
      return response.ok({ data: personal })
    } catch (e) {
      console.log('update Personal: ', e)
      return response.internalServerError()
    }
  }
  public async destroy({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const personal = await Personal.findOrFail(id)
      const deletedPersonal = await personal.delete()
      return response.ok({ data: deletedPersonal })
    } catch (e) {
      console.log('delete Personal: ', e)
      return response.internalServerError()
    }
  }
}
