import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Personals extends BaseSchema {
  protected tableName = 'personals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('dni')
      table.string('address')
      table.date('born_date')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.integer('personal_type_id').unsigned().references('personal_types.id')
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
