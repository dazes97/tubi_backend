import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'
import Personal from './Personal'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Branch extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public description: string

  @column({ serializeAs: 'attentionCapacity' })
  public attentionCapacity: number

  @column()
  public type: number

  @column()
  public lat: string

  @column()
  public lng: string

  @column()
  public status: number

  @column({ serializeAs: 'companyId' })
  public companyId: number

  @column()
  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @hasMany(() => Personal)
  public personals: HasMany<typeof Personal>

  @manyToMany(() => Service, {
    localKey: 'id',
    pivotForeignKey: 'branch_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'service_id',
    pivotTable: 'branch_service',
  })
  public services: ManyToMany<typeof Service>

  @beforeFind()
  public static ignoreDeleted(query: ModelQueryBuilderContract<typeof Branch>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static filterDeleted(query: ModelQueryBuilderContract<typeof Branch>) {
    query.whereNull('deleted_at')
  }

  public async delete() {
    this.deletedAt = DateTime.local()
    await this.save()
  }

  public static async updateBranch(body: any, authId: any, branchId) {
    return await Database.transaction(async (trx) => {
      try {
        const companyId = await Personal.getCompanyId(authId)
        const branchToUpdate = await Branch.query()
          .where('companyId', companyId)
          .andWhere('id', branchId)
          .firstOrFail()
        if (!body.packages && !body.services) {
          branchToUpdate.useTransaction(trx)
          await trx.commit()
          return await branchToUpdate.merge(body).save()
        }
        if (body.services) {
          for (let i = 0; i < body.services.toAdd.length; i++) {
            await trx.insertQuery().table('branch_service').insert({
              branch_id: branchToUpdate.id,
              service_id: body.services.toAdd[i],
            })
          }
          for (let i = 0; i < body.services.toDelete.length; i++) {
            await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.services.toDelete[i])
              .delete()
          }
        }
        if (body.packages) {
          for (let i = 0; i < body.packages.toAdd.length; i++) {
            await trx.insertQuery().table('branch_service').insert({
              branch_id: branchToUpdate.id,
              service_id: body.packages.toAdd[i],
            })
          }
          for (let i = 0; i < body.packages.toDelete.length; i++) {
            await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.packages.toDelete[i])
              .delete()
          }
        }
        await trx.commit()
        return branchToUpdate
      } catch (e) {
        console.log('Branch.updateBranch: ', e)
        await trx.rollback()
        throw new Error()
      }
    })
  }
  public static async deleteBranch(branchId, authId) {
    return Database.transaction(async (trx) => {
      try {
        const companyId = await Personal.getCompanyId(authId)
        const branchToDelete = await Branch.query()
          .where('id', branchId)
          .andWhere('companyId', companyId)
          .andWhereNull('deletedAt')
          .firstOrFail()
        branchToDelete.useTransaction(trx)
        const serviceAndPackagesFromThisBranch = await trx
          .query()
          .from('branch_service')
          .where('branch_id', branchId)
          .select('service_id as serviceId')
        for (let i = 0; i < serviceAndPackagesFromThisBranch.length; i++) {
          await trx
            .query()
            .from('branch_service')
            .where('branch_id', branchId)
            .andWhere('service_id', serviceAndPackagesFromThisBranch[i].serviceId)
            .delete()
        }
        const branchDeleted = await branchToDelete.delete()
        await trx.commit()
        return branchDeleted
      } catch (e) {
        console.log('Package.deletePackage: ', e)
        trx.rollback()
        throw new Error()
      }
    })
  }
}
