import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { DateTime } from 'luxon'

export default class RequestStatusSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('quote_status')
      .insert([
        {
          quote_id: 1,
          status_quote_id: 0,
          personal_id: 3,
          company_id: 2,
          created_at: DateTime.local().toUTC().toISO(),
        },
        {
          quote_id: 2,
          status_quote_id: 0,
          personal_id: 3,
          company_id: 2,
          created_at: DateTime.local().toUTC().toISO(),
        },
      ])
  }
}
