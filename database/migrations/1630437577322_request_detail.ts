import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RequestBranchServices extends BaseSchema {
  protected tableName = 'request_detail'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('request_id').unsigned().references('id').inTable('requests').index()
      table.increments('request_detail_id').primary().notNullable()
      table.integer('service_id').unsigned().references('id').inTable('services').index()
      table.unique(['request_id', 'request_detail_id'])
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
