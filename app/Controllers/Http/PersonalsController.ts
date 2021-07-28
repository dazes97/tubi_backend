import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'

export default class PersonalsController {
  public async index({}: HttpContextContract) {
    const personals = Personal.query().preload('user')
    return personals
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
