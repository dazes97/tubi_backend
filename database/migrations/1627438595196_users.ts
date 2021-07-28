import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email')
      table.string('password')
      table.string('name')
      table.string('lastname')
      table.string('gender').nullable()
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
