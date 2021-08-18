import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PackageService extends BaseSchema {
  protected tableName = 'package_service'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('package_id').unsigned().references('services.id')
      table.integer('service_id').unsigned().references('packages.id')
      table.unique(['package_id', 'service_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
      table.timestamp('deleted_at', { useTz: false })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
