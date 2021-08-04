// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PersonalType from 'App/Models/PersonalType'
export default class PersonalTypesController {
  public async index({ response }) {
    const personalTypes = await PersonalType.all()
    return response.ok({ data: personalTypes })
  }
  public async store({ request, response }) {
    const personalType = await PersonalType.create(request.body())
    return response.created({ data: personalType })
  }
  public async update({ request, response }) {
    const id = request.param('id')
    const personalType = await PersonalType.findOrFail(id)
    const updatedPersonalType = await personalType.merge({ name: request.input('name') }).save()
    return response.ok({ data: updatedPersonalType })
  }
  public async destroy({ request, response }) {
    const id = request.param('id')
    const personalType = await PersonalType.findOrFail(id)
    const deletedPersonalType = await personalType.delete()
    return response.ok({ data: deletedPersonalType })
  }
}
