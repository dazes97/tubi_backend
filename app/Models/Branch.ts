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
    //localKey: 'id',
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
  public static async getBranchPerCompany(authId: any) {
    const companyId = await Personal.getCompanyId(authId)
    const requests = await Database.rawQuery(
      ` SELECT
            DISTINCT ON (b.id) b.id,
            b.name,
            b.address,
            b.description,
            b.attention_capacity as "attentionCapacity",
            b.type,
            b.status,
            b.lat,
            b.lng,
            b.company_id as "companyId",
            ARRAY(
              SELECT json_agg(service) FROM 
              (
                SELECT
                DISTINCT ON (s.id) 
                s.id,
                s.name,
                s.price,
                s.description,
                s.type,
                s.location,
                bs.status,
                ARRAY(
                  SELECT json_agg(services) FROM 
                  (
                    SELECT 
                    s1.id,
                    s1.name,
                    s1.price,
                    s1.description,
                    s1.type,
                    s1.location
                    FROM services as s1
                    INNER JOIN package_service as ps on ps.service_id = s1.id  
                    WHERE ps.package_id = s.id AND ps.deleted_at IS NULL
                  ) services
                ) as services
                FROM services as s
                INNER JOIN branch_service as bs on bs.service_id = s.id AND bs.deleted_at IS NULL 
                WHERE bs.branch_id = b.id
                ORDER BY s.id  ASC

              ) service
            ) as services,
            ARRAY(
              SELECT json_agg(personals) FROM 
              (
                SELECT
                p.id,
                p.dni,
                u.name,
                u.last_name as "lastName",
                u.email
                FROM personals as p
                INNER JOIN users as u on u.id = p.id 
                WHERE p.branch_id = b.id
                ORDER BY p.created_at DESC
                ) personals
              ) as personals
          FROM branches as b
          WHERE b.company_id = ?
          AND b.deleted_at IS NULL
          ORDER BY b.id  DESC
            `,
      [companyId]
    )
    return requests.rows
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
              created_at: DateTime.now().toISO(),
              updated_at: DateTime.now().toISO(),
            })
          }
          for (let i = 0; i < body.services.toDelete.length; i++) {
            await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.services.toDelete[i])
              .update({ deleted_at: DateTime.now().toISO() })
          }
          for (let i = 0; i < body.services.toChangeStatus.length; i++) {
            const branchService = await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.services.toChangeStatus[i])
              .firstOrFail()
            const statusToUpdate = branchService.status === '1' ? '0' : '1'
            await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.services.toChangeStatus[i])
              .update({ status: statusToUpdate, updated_at: DateTime.now().toISO() })
          }
        }
        if (body.packages) {
          for (let i = 0; i < body.packages.toAdd.length; i++) {
            await trx.insertQuery().table('branch_service').insert({
              branch_id: branchToUpdate.id,
              service_id: body.packages.toAdd[i],
              created_at: DateTime.now().toISO(),
              updated_at: DateTime.now().toISO(),
            })
          }
          for (let i = 0; i < body.packages.toDelete.length; i++) {
            await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.packages.toDelete[i])
              .update({ deleted_at: DateTime.now().toISO() })
          }
          for (let i = 0; i < body.packages.toChangeStatus.length; i++) {
            const branchService = await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.packages.toChangeStatus[i])
              .firstOrFail()
            const statusToUpdate = branchService.status === '1' ? '0' : '1'
            await trx
              .query()
              .from('branch_service')
              .where('branch_id', branchToUpdate.id)
              .andWhere('service_id', body.packages.toChangeStatus[i])
              .update({ status: statusToUpdate, updated_at: DateTime.now().toISO() })
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
          .whereNull('deleted_at')
          .select('service_id as serviceId')
        for (let i = 0; i < serviceAndPackagesFromThisBranch.length; i++) {
          await trx
            .query()
            .from('branch_service')
            .where('branch_id', branchId)
            .andWhere('service_id', serviceAndPackagesFromThisBranch[i].serviceId)
            .update({ deleted_at: DateTime.now().toISO() })
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
