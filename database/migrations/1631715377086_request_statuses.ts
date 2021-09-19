import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RequestStatus extends BaseSchema {
  protected tableName = 'request_status'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('status', 1).notNullable()
      table.text('observation').notNullable().defaultTo('')
      table.integer('personal_id').unsigned().references('personals.id').notNullable()
      table.integer('company_id').unsigned().references('companies.id').notNullable()
      table.integer('request_id').unsigned().references('requests.id').notNullable()
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
