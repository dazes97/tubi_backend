import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RequestBranchServices extends BaseSchema {
  protected tableName = 'request_branch_service'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('request_id').unsigned().references('id').inTable('requests').index()
      table
        .integer('branch_service_id')
        .unsigned()
        .references('id')
        .inTable('branch_service')
        .index()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
