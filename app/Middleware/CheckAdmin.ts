import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'
import Personal from 'App/Models/Personal'
import { SUPER_ADMIN, ROLE_ID } from '../utils/roleConstant'
export default class CheckAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user?.id) return response.unauthorized({ error: 'Not Authorized' })
    const personal = await Personal.findOrFail(auth.user.id)
    const company = await Company.findOrFail(personal.companyId)
    if (company.nit === SUPER_ADMIN.NIT && company.name === ROLE_ID.ADMIN) await next()
    return response.unauthorized({ error: 'Not Authorized' })
  }
}
