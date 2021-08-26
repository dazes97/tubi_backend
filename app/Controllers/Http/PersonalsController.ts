import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Personal from 'App/Models/Personal'
import { ROLE_ID } from '../../utils//roleConstant'
export default class PersonalsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const personals = await Personal.query()
        .where('companyId', companyId)
        .andWhere('personalTypeId', '!=', ROLE_ID.PROPIETARIO)
        .preload('user')
        .preload('personalType', (personalTypeQuery) => {
          personalTypeQuery.select('id', 'name')
        })
        .preload('branch', (branchQuery) => {
          branchQuery.select('id', 'name')
        })
      response.ok({ data: personals })
    } catch (e) {
      console.log('PersonalsController.index: ', e)
      response.internalServerError()
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const personal = await Personal.createPersonal(request.body(), auth.user?.id)
      response.ok(personal)
    } catch (e) {
      console.log('PersonalsController.store: ', e)
      response.internalServerError()
    }
  }

  public async update({ request, auth, response }: HttpContextContract) {
    try {
      const id = request.param('id')
      const personal = await Personal.updatePersonal(request.body(), id, auth.user?.id)
      response.ok({ data: personal })
    } catch (e) {
      console.log('PersonalsController.update: ', e)
      response.internalServerError()
    }
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    try {
      const id = request.param('id')
      const companyId = await Personal.getCompanyId(auth.user?.id)
      const personal = await Personal.findPersonalByCompany(id, companyId)
      const deletedPersonal = await personal.delete()
      response.ok({ data: deletedPersonal })
    } catch (e) {
      console.log('personalsController.destroy: ', e)
      response.internalServerError()
    }
  }
}
