import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import PersonalType from 'App/Models/PersonalType'
export default class PersonalTypesController {
  public async index({ response }: HttpContextContract) {
    try {
      const personalTypes = await PersonalType.all()
      return response.ok({ data: personalTypes })
    } catch (e) {
      console.log('PersonalTypeController.index: ', e)
      return response.internalServerError()
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const personalId = auth.user?.id
      if (!personalId) return response.internalServerError()
      const personal = await Personal.findOrFail(personalId)
      const personalType = await PersonalType.create({
        ...request.body(),
        companyId: personal?.companyId,
      })
      return response.ok({ data: personalType })
    } catch (e) {
      console.log('PersonalTypeController.store: ', e)
      return response.internalServerError()
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const personalType = await PersonalType.findOrFail(id)
      const updatedPersonalType = await personalType.merge(request.body()).save()
      return response.ok({ data: updatedPersonalType })
    } catch (e) {
      console.log('PersonalTypeController.update: ', e)
      return response.internalServerError()
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const personalType = await PersonalType.findOrFail(id)
      const deletedPersonalType = await personalType.delete()
      return response.ok({ data: deletedPersonalType })
    } catch (e) {
      console.log('PersonalTypeController.destroy: ', e)
      return response.internalServerError()
    }
  }
}
