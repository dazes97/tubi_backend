import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Requests extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('bike_brand').notNullable()
      table.string('bike_model').notNullable()
      table.string('bike_color').notNullable()
      table.string('bike_wheel_size').notNullable()
      table.text('bike_photo')
      table.text('bike_observation')
      table.decimal('request_total').notNullable()
      table.timestamp('request_delivery_date_time', { useTz: false }).notNullable()
      table.string('request_code').notNullable()
      table.string('request_status').notNullable().defaultTo('0')
      table.string('client_name').notNullable()
      table.string('client_last_name').notNullable()
      table.string('client_phone').notNullable()
      table.string('client_lat')
      table.string('client_lng')
      table.string('client_address')
      table.string('client_address_detail')
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
