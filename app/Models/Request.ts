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
import REQUEST_CODE from 'App/utils/requestCode'
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

  @column()
  public branchId: number

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
  public static findStatus(item: any) {
    switch (item.status) {
      case REQUEST_CODE.RECEIVED.CODE:
        return REQUEST_CODE.RECEIVED.NAME
      case REQUEST_CODE.ACCEPTED.CODE:
        return REQUEST_CODE.ACCEPTED.NAME
      case REQUEST_CODE.DENIED.CODE:
        return REQUEST_CODE.DENIED.NAME
      case REQUEST_CODE.DELIVERED.CODE:
        return REQUEST_CODE.DELIVERED.NAME
      case REQUEST_CODE.FINISHED.CODE:
        return REQUEST_CODE.FINISHED.NAME
      case REQUEST_CODE.PROCESS.CODE:
        return REQUEST_CODE.PROCESS.NAME
      default:
        return 'Sin Definir'
    }
  }
  public static trackingNumber(pr = 'T', su = 'R') {
    for (let i = 0; i < 5; i++) pr += ~~(Math.random() * 10)
    return pr + su
  }
  //client API
  public static async getRequestTrackingForBot(requestCode: string) {
    let textResponse = ''
    if (requestCode.trim().length === 0) return 'Codigo Invalido'
    const trackingInfo = await this.getRequestTracking(requestCode.toUpperCase())
    if (trackingInfo) {
      textResponse += `Sucursal: ${trackingInfo.branchName} \n`
      textResponse += `Direccion: ${trackingInfo.branchAddress} \n`
      textResponse += `Codigo: ${requestCode.toUpperCase()} \n`
      textResponse += 'Paquetes y servicios: \n'
      trackingInfo.services[0].forEach((e, index) => {
        textResponse +=
          `${index + 1}) ${e.name}` + (e.type === '1' ? '(Servicio)' : '(Paquete)') + '\n'
      })
      textResponse += 'Seguimiento: \n'
      trackingInfo.statuses[0].forEach((e, index) => {
        textResponse +=
          `${index + 1}) ${this.findStatus(e)} (${e.date}) \n` +
          (e.observation.length > 0 ? `${e.observation} \n` : 'Sin observaciones \n')
      })
    } else {
      textResponse += 'Sin resultados'
    }
    textResponse += '\n Escriba Menu para volver al menu principal '
    return textResponse
  }
  public static async getRequestTracking(requestCode: string) {
    const requestTrackingForClient = await Database.rawQuery(
      ` SELECT
              to_char(r.request_delivery_date_time AT time zone 'utc' at time zone 'America/La_Paz','DD-MM-YYYY hh12:mi:ss AM') as "requestDeliveryDateTime",
              ARRAY(
                SELECT json_agg(service) FROM 
                (
                  SELECT 
                  s.name, s.price, s.type
                  FROM services as s 
                  INNER JOIN request_detail as rs on rs.service_id = s.id
                  WHERE rs.request_id = r.id
                  ) service
                ) as services,
              ARRAY(
                SELECT json_agg(statuses) FROM 
                (
                  SELECT 
                 rs.status_request_id as "status", rs.observation, to_char(r.created_at AT time zone 'utc' at time zone 'America/La_Paz','DD-MM-YYYY hh12:mi:ss AM') as "date"
                  FROM request_status as rs
                  WHERE rs.request_id = r.id
                  ORDER BY r.created_at DESC
                  ) statuses
                ) as statuses,
                b.name as "branchName",
                b.address as "branchAddress"
            FROM requests as r
            INNER JOIN branches as b ON b.id = r.branch_id AND b.deleted_at IS NULL 
            WHERE r.request_code = ?
            AND r.deleted_at IS NULL
              `,
      [requestCode]
    )
    return requestTrackingForClient.rowCount > 0 ? requestTrackingForClient.rows.pop() : null
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
            ARRAY(
              SELECT json_agg(service) FROM 
              (
                SELECT 
                s.id, s.name, s.price, s.description, s.type
                FROM services as s 
                INNER JOIN request_detail as rs on rs.service_id = s.id
                WHERE rs.request_id = r.id
                ) service
              ) as services,
            ARRAY(
              SELECT json_agg(statuses) FROM 
              (
                SELECT 
                rs.request_id as "requestId", rs.status_request_id as "status", rs.observation, rs.created_at as "createdAt", CONCAT (us.name, ' ', us.last_name) as "personal"
                FROM request_status as rs
                INNER JOIN personals pe on pe.id = rs.personal_id AND pe.deleted_at IS NULL
                INNER JOIN users us on us.id = rs.personal_id AND us.deleted_at IS NULL
                WHERE rs.request_id = r.id
                ORDER BY r.created_at DESC
                ) statuses
              ) as statuses
          FROM requests as r
            INNER JOIN branches as b on b.id = r.branch_id
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
          const service = await await Service.query()
            .where('company_id', companyId)
            .andWhere('id', request.services[i].id)
            .firstOrFail()
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
        requestToCreate.branchId = personal.branchId
        if (request.bikePhoto) {
          requestToCreate.bikePhoto = request.bikePhoto
        }
        requestToCreate.useTransaction(trx)
        const requestCreated = await requestToCreate.save()
        //insert services with branch services table with the respective status
        for (let i = 0; i < request.services.length; i++) {
          const serviceToInsert = await Service.query()
            .where('company_id', companyId)
            .andWhere('id', request.services[i].id)
            .firstOrFail()
          await trx.insertQuery().table('request_detail').insert({
            request_id: requestCreated.id,
            service_id: serviceToInsert.id,
            created_at: DateTime.local().toUTC().toISO(),
            updated_at: DateTime.local().toUTC().toISO(),
          })
        }
        //Insert first status
        await trx.insertQuery().table('request_status').insert({
          status_request_id: 0,
          request_id: requestCreated.id,
          personal_id: personal.id,
          company_id: companyId,
          created_at: DateTime.local().toUTC().toISO(),
          updated_at: DateTime.local().toUTC().toISO(),
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
        //find the persoanl to save in the records
        const personal = await Personal.findOrFail(authId)
        //find the request by code
        const requestToUpdateByCode = await Database.from('requests')
          .where('request_code', request.requestCode)
          .andWhere('company_id', personal.companyId)
          .firstOrFail()
        const requestToUpdate = await Request.findOrFail(requestToUpdateByCode.id)
        //find the client to send notifications
        //const client = await this.findClientByRequest(requestToUpdateByCode)
        requestToUpdate.requestStatus = request.newStatus.status
        requestToUpdate.useTransaction(trx)
        await requestToUpdate.save()
        await trx.insertQuery().table('request_status').insert({
          status_request_id: request.newStatus.status,
          observation: request.newStatus.observation,
          company_id: personal.companyId,
          personal_id: personal.id,
          request_id: requestToUpdate.id,
          created_at: DateTime.local().toUTC().toISO(),
          updated_at: DateTime.local().toUTC().toISO(),
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
  public static async findClientByRequest(requestCode: any) {
    const client = await Database.from('users')
      .innerJoin('clients', 'clients.id', '=', 'users.id')
      .innerJoin('requests', 'requests.client_id', '=', 'clients.id')
      .where('requests.request_code', requestCode)
      .first()
    console.log('cliente encontrado', client)
    return client
  }
  public static async sendNotificationStatusUpdateToClient(requestCode: any) {
    const client = await this.findClientByRequest(requestCode)
    if (!client) return
  }
}
