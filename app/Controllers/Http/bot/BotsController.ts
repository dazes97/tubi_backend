import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Branch from 'App/Models/Branch'
import Company from 'App/Models/Company'
import Request from 'App/Models/Request'
import Service from 'App/Models/Service'

export default class BotsController {
  public async index({ request }: HttpContextContract) {
    try {
      const body = request.body()
      // console.log('body: ', JSON.stringify(body))
      switch (body.queryResult.intent.displayName) {
        case 'mostrar_menu_opcion_1':
          const companies = await Company.getCompaniesForBot()
          return BotsController.sendResponseToBot(companies)
        case 'mostrar_menu_opcion_1_seleccion_empresa':
          const companyId = body.queryResult.parameters?.companyId
          const branches = await Branch.getBranchesForBot(companyId)
          return BotsController.sendResponseToBot(branches)
        case 'mostrar_menu_opcion_1_seleccion_empresa_seleccion_sucursal':
          const branchId = body.queryResult.outputContexts[0]?.parameters?.branchId
          const companyId1 = body.queryResult.outputContexts[0]?.parameters?.companyId
          console.log('branchId: ', branchId)
          console.log('companyid: ', companyId1)
          const services = await Service.getServicesByBranchForBot(branchId, companyId1)
          return BotsController.sendResponseToBot(services)

        default:
          return {
            fulfillmentMessages: [
              {
                text: {
                  text: ['no encontro el case'],
                },
              },
            ],
          }
      }
    } catch (e) {}
  }
  public static sendResponseToBot(data: string) {
    return {
      fulfillmentMessages: [
        {
          text: {
            text: [data],
          },
        },
      ],
    }
  }
  public async getTracking({ request, response }: HttpContextContract) {
    try {
      const trackingCode = request.input('trackingCode').trim()
      const requestTracking = await Request.getRequestForTracking(trackingCode)
      response.ok({ data: requestTracking })
    } catch (e) {
      response.internalServerError()
    }
  }
  public async getCompanies({ response }: HttpContextContract) {
    try {
      const companies = await Company.getCompaniesForBot()
      response.ok({ data: companies })
    } catch (e) {
      response.internalServerError()
    }
  }
  public async getBranchesByCompany({ request, response }: HttpContextContract) {
    try {
      const companyId = request.input('companyId').trim()
      console.log('companyId: ', companyId)
      const branches = await Branch.getBranchesForBot(companyId)
      response.ok({ data: branches })
    } catch (e) {
      response.internalServerError()
    }
  }
  public async getServicesByBranch({ request, response }: HttpContextContract) {
    try {
      const companyId = request.input('companyId')
      const branchId = request.input('branchId')
      console.log('companyId: ', companyId)
      console.log('branchId: ', branchId)
      const services = await Service.getServicesByBranchForBot(branchId, companyId)
      response.ok({ data: services })
    } catch (e) {
      console.log('e: ', e)
      response.internalServerError()
    }
  }
}