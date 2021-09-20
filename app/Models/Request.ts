import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Personal from './Personal'
import Service from './Service'
export default class Request extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bikeBrand: string

  @column()
  public bikeModel: string

  @column()
  public bikeWheelSize: number

  @column()
  public bikeColor: string

  @column()
  public bikePhoto: string

  @column()
  public bikeObservation: string

  @column()
  public clientName: string

  @column()
  public clientLastName: string

  @column()
  public clientPhone: string

  @column()
  public clientLat: string

  @column()
  public clientLng: string

  @column()
  public clientAddress: string

  @column()
  public clientAddressDetail: string

  @column()
  public requestTotal: number

  @column()
  public requestDeliveryDateTime: DateTime

  @column()
  public requestStatus: string

  @column()
  public requestCode: string

  @column()
  public clientId: number

  @column()
  public personalId: number

  @column()
  public companyId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Request>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static filterDeleted(query: ModelQueryBuilderContract<typeof Request>) {
    query.whereNull('deleted_at')
  }

  public async delete(): Promise<void> {
    this.deletedAt = DateTime.local()
    await this.save()
  }
  public static trackingNumber(pr = 'T', su = 'S') {
    for (let i = 0; i < 5; i++) pr += ~~(Math.random() * 10)
    return pr + su
  }
  public static async getRequestPerBranch(authId: any) {
    const companyId = await Personal.getCompanyId(authId)
    const personal = await Personal.findOrFail(authId)
    const requests = await Database.rawQuery(
      ` SELECT
            DISTINCT ON (r.id) r.id,
            r.bike_brand as "bikeBrand",
            r.bike_model as "bikeModel",
            r.bike_color as "bikeColor",
            r.bike_wheel_size as "bikeWheelSize",
            r.bike_photo as "bikePhoto",
            r.bike_observation as "bikeObservation",
            r.request_total as "requestTotal",
            r.request_code as "requestCode",
            r.client_name as "clientName",
            r.client_last_name as "clientLastName",
            r.client_phone as "clientPhone",
            r.client_lat as "clientLat",
            r.client_lng as "clientLng",
            r.client_address as "clientAddress",
            r.client_address_detail as "clientAddressDetail",
            r.created_at as "requestCreatedAt",
            r.request_status as "requestStatus",
            r.request_delivery_date_time as "requestDeliveryDateTime",
            u.name as "personalName",
            u.last_name as "personalLastName",
            ARRAY(
              SELECT json_agg(service) FROM 
              (
                SELECT 
                s.id, s.name, s.price, s.description, s.type
                FROM services as s 
                INNER JOIN branch_service as bsa on bsa.service_id = s.id
                INNER JOIN request_branch_service as rbsa on rbsa.branch_service_id = bsa.id
                WHERE rbsa.request_id = r.id
                ) service
              ) as services,
            ARRAY(
              SELECT json_agg(statuses) FROM 
              (
                SELECT 
                rs.id, rs.status, rs.observation, rs.created_at as "createdAt"
                FROM request_status as rs 
                WHERE rs.request_id = r.id
                ORDER BY r.created_at DESC
                ) statuses
              ) as statuses
          FROM requests as r
            INNER JOIN request_branch_service as rbs on rbs.request_id = r.id
            INNER JOIN branch_service as bs on bs.id = rbs.branch_service_id
            INNER JOIN branches as b on b.id = bs.branch_id
            INNER JOIN personals as p on p.id = r.personal_id
            INNER JOIN users as u on u.id = p.id
          WHERE b.id = ?
          AND b.company_id = ?
          AND r.company_id = ?
          AND r.deleted_at IS NULL
          ORDER BY r.id  DESC
            `,
      [personal.branchId, companyId, companyId]
    )
    return requests.rows
  }
  public static async createRequest(authId: any, request: any) {
    return await Database.transaction(async (trx) => {
      try {
        const personal = await Personal.findOrFail(authId)
        const companyId = await Personal.getCompanyId(authId)
        let requestTotal: number = 0
        for (let i = 0; i < request.services.length; i++) {
          const service = await Service.findOrFail(request.services[i].id)
          requestTotal = requestTotal + Number(service.price)
        }
        const requestToCreate = new Request()
        requestToCreate.bikeBrand = request.bikeBrand
        requestToCreate.bikeColor = request.bikeColor
        requestToCreate.bikeModel = request.bikeModel
        requestToCreate.bikeObservation = request.bikeObservation
        requestToCreate.bikePhoto = request.bikePhoto
        requestToCreate.bikeWheelSize = request.bikeWheelSize
        requestToCreate.clientName = request.clientName
        requestToCreate.clientLastName = request.clientLastName
        requestToCreate.clientAddress = request.clientAddress
        requestToCreate.clientAddressDetail = request.clientAddressDetail
        requestToCreate.clientPhone = request.clientPhone
        requestToCreate.requestDeliveryDateTime = request.requestDeliveryDateTime
        requestToCreate.requestTotal = requestTotal
        requestToCreate.requestCode = this.trackingNumber()
        requestToCreate.personalId = personal.id
        requestToCreate.companyId = companyId
        if (request.bikePhoto) {
          requestToCreate.bikePhoto = request.bikePhoto
        }
        requestToCreate.useTransaction(trx)
        const requestCreated = await requestToCreate.save()
        //insert services with branch services table with the respective status
        for (let i = 0; i < request.services.length; i++) {
          const serviceBranch = await Database.query()
            .select('id')
            .from('branch_service')
            .where('branch_id', personal.branchId)
            .andWhere('service_id', request.services[i].id)
            .firstOrFail()
          await trx.insertQuery().table('request_branch_service').insert({
            request_id: requestCreated.id,
            branch_service_id: serviceBranch.id,
          })
        }
        //Insert first status
        await trx.insertQuery().table('request_status').insert({
          status: 0,
          request_id: requestCreated.id,
          personal_id: personal.id,
          company_id: companyId,
        })
        await trx.commit()
        return requestCreated
      } catch (e) {
        console.log('Request.createRequest: ', e)
        await trx.rollback()
        throw new Error()
      }
    })
  }
  public static async updateRequestStatus(authId: any, request: any) {
    return await Database.transaction(async (trx) => {
      try {
        const personal = await Personal.findOrFail(authId)
        const requestToUpdate = await Request.findOrFail(request.id)
        requestToUpdate.requestStatus = request.newStatus.status
        requestToUpdate.useTransaction(trx)
        await requestToUpdate.save()
        await trx.insertQuery().table('request_status').insert({
          status: request.newStatus.status,
          observation: request.newStatus.observation,
          company_id: personal.companyId,
          personal_id: personal.id,
          request_id: requestToUpdate.id,
          created_at: DateTime.now(),
        })
        await trx.commit()
        return requestToUpdate
      } catch (e) {
        console.log('Requests.updateRequestStatus: ', e)
        await trx.rollback()
        throw new Error()
      }
    })
  }
}
