import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class RequestStatusSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('request_status')
      .insert([
        { status: 0, request_id: 1, personal_id: 3, company_id: 2 },
        { status: 0, request_id: 2, personal_id: 3, company_id: 2 },
      ])
  }
}
