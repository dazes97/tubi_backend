import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  HasMany,
  hasMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import PersonalType from './PersonalType'
import Personal from './Personal'
import Service from './Service'

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

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @hasMany(() => PersonalType)
  public personalTypes: HasMany<typeof PersonalType>

  @hasMany(() => Personal)
  public personals: HasMany<typeof Personal>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Company>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static filterDeleted(query: ModelQueryBuilderContract<typeof Company>) {
    query.whereNull('deleted_at')
  }

  public async delete() {
    this.deletedAt = DateTime.local()
    await this.save()
  }
  public static async getCompaniesForBot() {
    const companies = await Company.query()
      .select('id', 'name', 'main_address', 'nit')
      .where('status', 1)
      .andWhereNull('deleted_at')
      .orderBy('id', 'asc')
    let textResponse = companies.length > 0 ? 'Seleccione la empresa: \n' : 'Sin Empresas'
    companies.forEach((e) => {
      textResponse = textResponse + `${e.id}.- ${e.name} \n`
    })
    textResponse = textResponse + '\n Escriba Menu para volver al menu principal '
    return textResponse
  }
}
