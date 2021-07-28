// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PersonalTypesController {
  public async index({ request }) {
    console.log('request: ', request)
    return 'hola'
  }
}
