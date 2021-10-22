import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Quotes extends BaseSchema {
  protected tableName = 'quotes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('quote_description').notNullable()
      table.string('quote_type', 2).notNullable()
      table.text('quote_photo').nullable()
      table.string('quote_code').notNullable()
      table.string('quote_status').notNullable().defaultTo('0')
      table.string('client_name').notNullable()
      table.string('client_last_name').notNullable()
      table.string('client_email').nullable()
      table.string('client_phone').nullable()
      table.string('client_address').nullable()
      table.integer('client_id').unsigned().references('clients.id')
      table.integer('personal_id').unsigned().references('personals.id')
      table.integer('company_id').unsigned().references('companies.id').notNullable()
      table.integer('branch_id').unsigned().references('branches.id').notNullable()
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
