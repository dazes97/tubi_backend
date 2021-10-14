import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Quotes extends BaseSchema {
  protected tableName = 'quotes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('quote_description').notNullable()
      table.string('quote_type').notNullable()
      table.text('quote_photo').nullable()
      table.string('quote_code')
      table.string('client_name')
      table.string('client_last_name')
      table.string('client_email').nullable()
      table.string('client_phone').nullable()
      table.string('client_address').nullable()

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
