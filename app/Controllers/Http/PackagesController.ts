import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Package from 'App/Models/Package'

export default class PackagesController {
  public async index({ request, auth, response }: HttpContextContract) {
    const packages = Package.query().preload('services')
    response.ok({ data: packages })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
