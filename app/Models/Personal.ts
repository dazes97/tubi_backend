import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  HasOne,
  hasOne,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
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

  @column({ serializeAs: 'bornDate' })
  public bornDate: string

  @column({ serializeAs: 'companyId' })
  public companyId: number

  @column({ serializeAs: 'personalTypeId' })
  public personalTypeId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => PersonalType)
  public personalType: BelongsTo<typeof PersonalType>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @hasOne(() => User, {
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>

  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Personal>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static filterDeleted(query: ModelQueryBuilderContract<typeof Personal>) {
    query.whereNull('deleted_at')
  }

  public async delete() {
    this.deletedAt = DateTime.local()
    await this.save()
  }
  public static async createPersonal(requestBody: any, userInfo: any) {
    const personalId = userInfo?.id
    if (!personalId) throw Error('nose encontro el personal')
    const userFoundByEmail = await User.findBy('email', requestBody.email)
    if (userFoundByEmail) throw Error('correo duplicado')
    const userFoundByDni = await Personal.findBy('dni', requestBody.dni)
    if (userFoundByDni) throw Error('Dni duplicado')
    const personalWhoIsCreating = await Personal.findOrFail(personalId)
    await Database.transaction(async (trx) => {
      const user = new User()
      user.name = requestBody.name
      user.lastName = requestBody.lastName
      user.email = requestBody.email
      user.password = requestBody.password
      user.gender = requestBody.gender
      user.useTransaction(trx)
      const newUser = await user.save()

      const personal = new Personal()
      personal.id = newUser.id
      personal.dni = requestBody.dni
      personal.address = requestBody.address
      personal.bornDate = requestBody.bornDate
      personal.companyId = personalWhoIsCreating.companyId
      personal.personalTypeId = requestBody.personalTypeId
      personal.useTransaction(trx)
      return await personal.save()
    })
  }
  public static async updatePersonal(requestBody: any, id: any) {
    await Database.transaction(async (trx) => {
      const user = await User.findOrFail(id)
      user.name = requestBody.name
      user.lastName = requestBody.lastName
      //user.email = requestBody.email
      if (requestBody.password.length > 0) user.password = requestBody.password
      user.gender = requestBody.gender
      user.useTransaction(trx)
      await user.save()

      const personal = await Personal.findOrFail(id)
      //personal.dni = requestBody.dni
      personal.address = requestBody.address
      personal.bornDate = requestBody.bornDate
      personal.personalTypeId = requestBody.personalTypeId
      personal.useTransaction(trx)
      return await personal.save()
    })
  }
}
