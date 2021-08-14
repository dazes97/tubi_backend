import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import PersonalType from 'App/Models/PersonalType'
import { ROLE_ID } from 'App/utils/roleConstant'
export default class PersonalTypesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      let personalTypes
      const personalWhoIsAsking = await Personal.findOrFail(auth.user?.id)
      if (personalWhoIsAsking.companyId === ROLE_ID.PROPIETARIO) {
        personalTypes = await PersonalType.all()
      } else {
        personalTypes = await PersonalType.query().where('id', '!=', ROLE_ID.PROPIETARIO)
      }
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
