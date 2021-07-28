import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import PersonalType from './PersonalType'
import Company from './Company'
import User from './User'

export default class Personal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public dni: string

  @column()
  public address: string

  @column()
  public bornDate: string

  @column({ columnName: 'company_id' })
  public companyId: number

  @column({ columnName: 'personal_type_id' })
  public personalTypeId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => PersonalType)
  public personalType: BelongsTo<typeof PersonalType>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @hasOne(() => User, {
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>
}
