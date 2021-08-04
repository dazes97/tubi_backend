// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Personal from 'App/Models/Personal'
import User from 'App/Models/User'

export default class AuthController {
  public async auth({ request, response, auth }) {
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
      return {
        user: {
          id: user.id,
          name: user.name,
          last_name: user.lastName,
          role_id: personal.personalTypeId,
        },
        token: token.toJSON(),
      }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
  public async logout({ auth }) {
    console.log('entro al logout')
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }
}
