import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import PersonalType from 'App/Models/PersonalType'
import { ROLE_ID } from '../utils/roleConstant'

export default class CheckCompanyPersonal {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (!auth.user?.id) return response.unauthorized({ error: 'Not Authorized' })
    const personal = await Personal.findOrFail(auth.user.id)
    const type = await PersonalType.findOrFail(personal.personalTypeId)
    if (type.id === ROLE_ID.PROPIETARIO) return response.unauthorized({ error: 'Not Authorized' })
    await next()
  }
}
