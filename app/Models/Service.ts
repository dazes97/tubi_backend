import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  manyToMany,
  ManyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'
import Personal from './Personal'
import Database from '@ioc:Adonis/Lucid/Database'
import SERVICE_TYPE from 'App/utils/serviceType'

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

  @column()
  public type: number

  @column()
  public location: number

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

  @manyToMany(() => Service, {
    localKey: 'id',
    pivotForeignKey: 'package_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'service_id',
    pivotTable: 'package_service',
  })
  public services: ManyToMany<typeof Service>

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

  public static async createPackage(body: any, authId: any) {
    return await Database.transaction(async (trx) => {
      try {
        const companyId = await Personal.getCompanyId(authId)
        const packageForCreation = new Service()
        packageForCreation.name = body.name
        packageForCreation.price = body.price
        packageForCreation.description = body.description
        packageForCreation.status = body.status
        packageForCreation.companyId = companyId
        packageForCreation.type = SERVICE_TYPE.PACKAGE
        packageForCreation.location = body.location
        packageForCreation.useTransaction(trx)
        const newPackage = await packageForCreation.save()
        for (let i = 0; i < body.services.length; i++) {
          await trx.insertQuery().table('package_service').insert({
            package_id: newPackage.id,
            service_id: body.services[i],
          })
        }
        await trx.commit()
        return newPackage
      } catch (e) {
        console.log('Package.createPackage: ', e)
        await trx.rollback()
        throw new Error()
      }
    })
  }
  public static async updatePackage(body: any, authId: any) {
    return await Database.transaction(async (trx) => {
      try {
        const companyId = await Personal.getCompanyId(authId)
        const packageToUpdate = await Service.query()
          .where('id', body.id)
          .andWhere('type', SERVICE_TYPE.PACKAGE)
          .andWhere('companyId', companyId)
          .andWhereNull('deletedAt')
          .firstOrFail()
        packageToUpdate.useTransaction(trx)
        packageToUpdate.merge({
          name: body.name,
          price: body.price,
          status: body.status,
          description: body.description,
          location: body.location,
        })
        const packageUpdated = await packageToUpdate.save()
        for (let i = 0; i < body.toAdd.length; i++) {
          await trx.insertQuery().table('package_service').insert({
            package_id: packageToUpdate.id,
            service_id: body.toAdd[i],
          })
        }
        for (let i = 0; i < body.toDelete.length; i++) {
          await trx
            .query()
            .from('package_service')
            .where('package_id', packageToUpdate.id)
            .andWhere('service_id', body.toDelete[i])
            .delete()
        }
        await trx.commit()
        return packageUpdated
      } catch (e) {
        console.log('Package.updatePackage: ', e)
        trx.rollback()
        throw new Error()
      }
    })
  }
  public static async deletePackage(packageId, authId) {
    return Database.transaction(async (trx) => {
      try {
        const companyId = await Personal.getCompanyId(authId)
        const packageToDelete = await Service.query()
          .where('id', packageId)
          .andWhere('type', SERVICE_TYPE.PACKAGE)
          .andWhere('companyId', companyId)
          .andWhereNull('deletedAt')
          .firstOrFail()
        packageToDelete.useTransaction(trx)
        const serviceFromThisPackage = await trx
          .query()
          .from('package_service')
          .where('package_id', packageId)
          .select('service_id as serviceId', 'package_id as packageId')
        for (let i = 0; i < serviceFromThisPackage.length; i++) {
          await trx
            .query()
            .from('package_service')
            .where('package_id', packageId)
            .andWhere('service_id', serviceFromThisPackage[i].serviceId)
            .delete()
        }
        const packageDeleted = await packageToDelete.delete()
        await trx.commit()
        return packageDeleted
      } catch (e) {
        console.log('Package.deletePackage: ', e)
        trx.rollback()
        throw new Error()
      }
    })
  }
}
