import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Personal from './Personal'
import Company from './Company'

export default class PersonalType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column({ columnName: 'company_id' })
  public companyId: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Personal)
  public personals: HasMany<typeof Personal>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>
}
