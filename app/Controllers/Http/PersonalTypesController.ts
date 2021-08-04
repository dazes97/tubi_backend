// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PersonalType from 'App/Models/PersonalType'

export default class PersonalTypesController {
  public async index() {
    const personalTypes = PersonalType.all()
    return personalTypes
  }
}
