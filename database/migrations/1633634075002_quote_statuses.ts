import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class QuoteStatuses extends BaseSchema {
  protected tableName = 'quote_status'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('quote_id').unsigned().references('quotes.id').notNullable()
      table.increments('id').primary()
      table.integer('status_quote_id').unsigned().references('id').inTable('status_quote')
      table.integer('personal_id').unsigned().references('personals.id').notNullable()
      table.integer('company_id').unsigned().references('companies.id').notNullable()
      table.text('observation').notNullable().defaultTo('')
      table.unique(['quote_id', 'id'])
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
