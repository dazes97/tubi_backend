import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import PersonalType from './PersonalType'
import Personal from './Personal'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public nit: string

  @column({ serializeAs: 'mainAddress' })
  public mainAddress: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => PersonalType)
  public personalTypes: HasMany<typeof PersonalType>

  @hasMany(() => Personal)
  public personals: HasMany<typeof Personal>
}
