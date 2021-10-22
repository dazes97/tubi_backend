import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Personal from './Personal'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Quote extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public quoteDescription: string

  @column()
  public quoteType: string

  @column()
  public quotePhoto: string

  @column()
  public quoteCode: string

  @column()
  public quoteStatus: string

  @column()
  public clientName: string

  @column()
  public clientLastName: string

  @column()
  public clientEmail: string

  @column()
  public clientPhone: string

  @column()
  public clientAddress: string

  @column()
  public clientId: number

  @column()
  public personalId: number

  @column()
  public companyId: number

  @column()
  public branchId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Quote>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static filterDeleted(query: ModelQueryBuilderContract<typeof Quote>) {
    query.whereNull('deleted_at')
  }

  public async delete(): Promise<void> {
    this.deletedAt = DateTime.local()
    await this.save()
  }
  public static async getQuotePerBranch(authId: any) {
    const companyId = await Personal.getCompanyId(authId)
    const personal = await Personal.findOrFail(authId)
    const quotes = await Database.rawQuery(
      ` SELECT
            DISTINCT ON (q.id) q.id,
            q.quote_code as "quoteCode",
            q.quote_photo as "quotePhoto",
            q.quote_description as "quoteDescription",
            q.quote_status as "quoteStatus",
            q.quote_type as "quoteType",
            q.client_name as "clientName",
            q.client_last_name as "clientLastName",
            q.client_phone as "clientPhone",
            q.client_address as "clientAddress",
            q.client_email as "clientEmail",
            q.created_at as "quoteCreatedAt",
            ARRAY(
              SELECT json_agg(statuses) FROM 
              (
                SELECT 
                qs.quote_id as "quoteId", qs.status_quote_id as "status", qs.observation, qs.created_at as "createdAt"
                FROM quote_status as qs 
                WHERE qs.quote_id = q.id
                ORDER BY q.created_at DESC
                ) statuses
              ) as statuses
          FROM quotes as q
            INNER JOIN branches as b on b.id = q.branch_id
          WHERE b.id = ?
          AND b.company_id = ?
          AND q.company_id = ?
          AND q.deleted_at IS NULL
          ORDER BY q.id  DESC
            `,
      [personal.branchId, companyId, companyId]
    )
    return quotes.rows
  }
  public static trackingNumber(pr = 'T', su = 'Q') {
    for (let i = 0; i < 5; i++) pr += ~~(Math.random() * 10)
    return pr + su
  }
  public static async createQuote(authId: any, quote: any) {
    return await Database.transaction(async (trx) => {
      try {
        const personal = await Personal.findOrFail(authId)
        const companyId = await Personal.getCompanyId(authId)
        const quoteToCreate = new Quote()
        quoteToCreate.quoteCode = this.trackingNumber()
        quoteToCreate.quoteDescription = quote.quoteDescription
        quoteToCreate.quoteType = quote.quoteType
        quoteToCreate.clientName = quote.clientName
        quoteToCreate.clientLastName = quote.clientLastName
        quoteToCreate.clientPhone = quote.clientPhone
        quoteToCreate.clientAddress = quote.clientAddress
        quoteToCreate.clientEmail = quote.clientEmail
        quoteToCreate.personalId = personal.id
        quoteToCreate.companyId = companyId
        quoteToCreate.branchId = personal.branchId
        quoteToCreate.createdAt = DateTime.local().toUTC()
        if (quote.quotePhoto) {
          quoteToCreate.quotePhoto = quote.quotePhoto
        }
        quoteToCreate.useTransaction(trx)
        const quoteCreated = await quoteToCreate.save()
        //Insert first status
        await trx.insertQuery().table('quote_status').insert({
          status_quote_id: 0,
          quote_id: quoteCreated.id,
          personal_id: personal.id,
          company_id: companyId,
          created_at: DateTime.local().toUTC().toISO(),
          updated_at: DateTime.local().toUTC().toISO(),
        })
        await trx.commit()
        return quoteCreated
      } catch (e) {
        console.log('Quote.createQuote: ', e)
        await trx.rollback()
        throw new Error()
      }
    })
  }
  public static async updateQuoteStatus(authId: any, quote: any) {
    return await Database.transaction(async (trx) => {
      try {
        const personal = await Personal.findOrFail(authId)
        const quoteToUpdate = await Quote.findOrFail(quote.id)
        quoteToUpdate.quoteStatus = quote.newStatus.status
        quoteToUpdate.useTransaction(trx).save()
        await trx.insertQuery().table('quote_status').insert({
          status_quote_id: quote.newStatus.status,
          observation: quote.newStatus.observation,
          company_id: personal.companyId,
          personal_id: personal.id,
          quote_id: quoteToUpdate.id,
          created_at: DateTime.local().toUTC().toISO(),
          updated_at: DateTime.local().toUTC().toISO(),
        })
        await trx.commit()
        return quoteToUpdate
      } catch (e) {
        console.log('Quote.updateQuoteStatus: ', e)
        await trx.rollback()
        throw new Error()
      }
    })
  }
}
