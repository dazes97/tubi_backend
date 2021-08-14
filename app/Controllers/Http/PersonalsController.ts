import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import { ROLE_ID } from '../../utils//roleConstant'
export default class PersonalsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const personal = await Personal.findOrFail(auth.user?.id)
      const personals = await Personal.query()
        .where('companyId', personal.companyId)
        .andWhere('personalTypeId', '!=', ROLE_ID.PROPIETARIO)
        .preload('user')
        .preload('personalType')
      return response.ok({ data: personals })
    } catch (e) {
      console.log('PersonalsController.index: ', e)
      return response.internalServerError()
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      if (!auth.user?.id) return response.internalServerError()
      const personal = await Personal.createPersonal(request.body(), auth.user.id)
      return response.ok(personal)
    } catch (e) {
      console.log('PersonalsController.store: ', e)
      return response.internalServerError()
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const personal = await Personal.updatePersonal(request.body(), id)
      return response.ok({ data: personal })
    } catch (e) {
      console.log('PersonalsController.update: ', e)
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
      console.log('personalsController.destroy: ', e)
      return response.internalServerError()
    }
  }
}
