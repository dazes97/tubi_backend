import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class RequestBranchServiceSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('request_service')
      .insert([
        { request_id: 1, service_id: 1 },
        { request_id: 1, service_id: 2 },
        { request_id: 2, service_id: 3 },
        { request_id: 2, service_id: 4 },
      ])
  }
}
