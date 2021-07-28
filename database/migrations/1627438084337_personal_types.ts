import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PersonalTypes extends BaseSchema {
  protected tableName = 'personal_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.integer('company_id').unsigned().references('companies.id')
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
      table.timestamp('deleted_at', { useTz: false })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
