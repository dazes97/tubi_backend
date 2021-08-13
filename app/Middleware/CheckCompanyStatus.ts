import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'
import Personal from 'App/Models/Personal'
export default class CheckCompanyStatus {
  public async handle({ response, auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (!auth.user?.id) return response.unauthorized({ error: 'Must be logged in' })
    const personal = await Personal.findOrFail(auth.user.id)
    const company = await Company.findOrFail(personal.companyId)
    if (company.status !== '1') return response.unauthorized({ error: 'Must be logged in' })
    await next()
  }
}
