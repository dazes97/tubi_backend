import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public price: number

  @column()
  public description: string

  @column()
  public status: string

  @column({ serializeAs: 'companyId' })
  public companyId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Service>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static filterDeleted(query: ModelQueryBuilderContract<typeof Service>) {
    query.whereNull('deleted_at')
  }

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  public async delete(): Promise<void> {
    this.deletedAt = DateTime.local()
    await this.save()
  }
  public static async findServiceByCompany(id: any, companyId) {
    return await Service.query()
      .where('companyId', companyId)
      .andWhere('id', id)
      .andWhereNull('deletedAt')
      .firstOrFail()
  }
}
