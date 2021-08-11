import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
      const cookieData = {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        roleId: personal.personalTypeId,
        companyId: personal.companyId,
      }
      const data = {
        user: cookieData,
        token: token.toJSON(),
      }
      return response.ok(data)
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
  public async logout({ request, response, auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.ok({ revoked: true })
  }
}
