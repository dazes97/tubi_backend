import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BranchServices extends BaseSchema {
  protected tableName = 'branch_service'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      //table.increments('id').primary()
      table.integer('branch_id').unsigned().references('id').inTable('branches').index()
      table.integer('service_id').unsigned().references('id').inTable('services').index()
      table.string('status', 2).defaultTo('1').notNullable()
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
