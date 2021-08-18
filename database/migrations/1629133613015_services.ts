import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Services extends BaseSchema {
  protected tableName = 'services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.decimal('price').notNullable()
      table.text('description').defaultTo('')
      table.string('status', 1).defaultTo('1').notNullable()
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
