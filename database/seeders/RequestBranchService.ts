import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class RequestBranchServiceSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('request_branch_service')
      .insert([
        { request_id: 1, branch_service_id: 3 },
        { request_id: 1, branch_service_id: 4 },
        { request_id: 2, branch_service_id: 5 },
        { request_id: 2, branch_service_id: 6 },
      ])
  }
}
