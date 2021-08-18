import { DateTime } from 'luxon'
import {
  BaseModel,
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

  @column.dateTime({ serializeAs: null })
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
    const companyId = await this.getCompanyId(personalId)
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
      personal.companyId = companyId
      personal.personalTypeId = requestBody.personalTypeId
      personal.useTransaction(trx)
      return await personal.save()
    })
  }
  public static async findPersonalByCompany(id: any, companyId) {
    return await Personal.query()
      .where('companyId', companyId)
      .andWhere('id', id)
      .andWhereNull('deletedAt')
      .firstOrFail()
  }
  public static async updatePersonal(requestBody: any, id: any, authId: any) {
    await Database.transaction(async (trx) => {
      const user = await User.findOrFail(id)
      user.name = requestBody.name
      user.lastName = requestBody.lastName
      if (requestBody.password.length > 0) user.password = requestBody.password
      user.gender = requestBody.gender
      user.useTransaction(trx)
      await user.save()

      const companyId = await this.getCompanyId(authId)
      const personal = await Personal.findPersonalByCompany(id, companyId)
      personal.address = requestBody.address
      personal.bornDate = requestBody.bornDate
      personal.personalTypeId = requestBody.personalTypeId
      personal.useTransaction(trx)
      return await personal.save()
    })
  }
  public static async createCompanyOwner(requestBody: any) {
    if (!requestBody.companyId) throw Error('Empresa no encontrada')
    const userFoundByEmail = await User.findBy('email', requestBody.email)
    if (userFoundByEmail) throw Error('correo duplicado')
    const userFoundByDni = await Personal.findBy('dni', requestBody.dni)
    if (userFoundByDni) throw Error('Dni duplicado')
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
      personal.companyId = requestBody.companyId
      personal.personalTypeId = requestBody.personalTypeId
      personal.useTransaction(trx)
      return await personal.save()
    })
  }
  public static async updateCompanyOwner(requestBody: any, id: any) {
    await Database.transaction(async (trx) => {
      const user = await User.findOrFail(id)
      user.name = requestBody.name
      user.lastName = requestBody.lastName
      user.email = requestBody.email
      if (requestBody.password.length > 0) user.password = requestBody.password
      user.gender = requestBody.gender
      user.useTransaction(trx)
      await user.save()

      const personal = await Personal.findOrFail(id)
      personal.dni = requestBody.dni
      personal.address = requestBody.address
      personal.bornDate = requestBody.bornDate
      personal.personalTypeId = requestBody.personalTypeId
      personal.useTransaction(trx)
      return await personal.save()
    })
  }
  public static async getCompanyId(authId: any) {
    const companyId = await Database.query()
      .select('p.company_id as companyId')
      .from('personals as p')
      .where('p.id', authId)
      .firstOrFail()
    return companyId.companyId
  }
  public static async getPersonalInfo(auth: any) {
    const personalInfo = await Database.query()
      .select(
        'p.company_id as companyId',
        'u.name',
        'u.last_name as lastName',
        'u.email',
        'u.gender',
        'pt.id as personalTypeId',
        'pt.name as personalTypeName'
      )
      .from('personals as p')
      .innerJoin('users as u', 'u.id', '=', 'p.id')
      .innerJoin('personal_types as pt', 'pt.id', '=', 'p.personal_type_id')
      .where('p.id', auth.user?.id)
      .firstOrFail()
    return personalInfo
  }
}
