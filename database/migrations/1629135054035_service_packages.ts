import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PackageService extends BaseSchema {
  protected tableName = 'package_service'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('package_id').unsigned().references('id').inTable('packages').index()
      table.integer('service_id').unsigned().references('id').inTable('services').index()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
