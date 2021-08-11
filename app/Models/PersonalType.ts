import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Personal from './Personal'
import Company from './Company'

export default class PersonalType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: 'companyId' })
  public companyId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof PersonalType>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static filterDeleted(query: ModelQueryBuilderContract<typeof PersonalType>) {
    query.whereNull('deleted_at')
  }

  @beforeDelete()
  public static async handleSoftDeletion(personalType: PersonalType) {
    personalType.deletedAt = DateTime.local()
    await personalType.save()
  }

  @hasMany(() => Personal)
  public personals: HasMany<typeof Personal>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>
}
