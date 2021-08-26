import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Branches extends BaseSchema {
  protected tableName = 'branches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('address').notNullable()
      table.text('description').notNullable().defaultTo('')
      table.integer('attention_capacity').notNullable()
      table.string('type', 2).notNullable()
      table.string('status', 2).notNullable().defaultTo('1')
      table.string('lat')
      table.string('lng')
      table.integer('company_id').unsigned().references('companies.id').notNullable()

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
