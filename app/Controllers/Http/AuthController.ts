import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'
import { SUPER_ADMIN } from '../../utils/roleConstant'
import Personal from 'App/Models/Personal'
import User from 'App/Models/User'

export default class AuthController {
  public async auth({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const remember = request.input('remember')
    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: remember ? '30days' : '1day',
        name: email,
      })
      const user = await User.findByOrFail('email', email)
      const personal = await Personal.findOrFail(user.id)
      const company = await Company.findOrFail(personal.companyId)
      if (company.status !== '1') return response.unauthorized({ error: 'Not Authorized' })
      const cookieData = {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        roleId:
          company.nit === SUPER_ADMIN.NIT && company.name === SUPER_ADMIN.COMPANY_NAME
            ? 0
            : personal.personalTypeId,
        companyId: personal.companyId,
      }
      const data = {
        user: cookieData,
        token: token.toJSON(),
      }
      response.ok(data)
    } catch {
      response.badRequest({ data: 'Invalid credentials' })
    }
  }
  public async logout({ response, auth }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      response.ok({ revoked: true })
    } catch (e) {
      response.internalServerError()
    }
  }
}
