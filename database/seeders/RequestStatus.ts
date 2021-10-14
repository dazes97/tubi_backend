import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class RequestStatusSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('request_status')
      .insert([
        { request_id: 1, status_request_id: 0, personal_id: 3, company_id: 2 },
        { request_id: 2, status_request_id: 0, personal_id: 3, company_id: 2 },
      ])
  }
}
