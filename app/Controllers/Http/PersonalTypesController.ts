import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import PersonalType from 'App/Models/PersonalType'
export default class PersonalTypesController {
  public async index({ response }: HttpContextContract) {
    const personalTypes = await PersonalType.all()
    return response.ok({ data: personalTypes })
  }
  public async store({ request, response, auth }: HttpContextContract) {
    const personalId = auth.user?.id
    if (!personalId) return response.abort('Internal Server Error', 500)
    const personal = await Personal.findOrFail(personalId)
    const personalType = await PersonalType.create({
      ...request.body(),
      companyId: personal?.companyId,
    })
    return response.created({ data: personalType })
  }
  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const personalType = await PersonalType.findOrFail(id)
    const updatedPersonalType = await personalType.merge({ name: request.input('name') }).save()
    return response.ok({ data: updatedPersonalType })
  }
  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const personalType = await PersonalType.findOrFail(id)
    const deletedPersonalType = await personalType.delete()
    return response.ok({ data: deletedPersonalType })
  }
}
