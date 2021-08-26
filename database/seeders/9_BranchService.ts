import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class BranchServiceSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('branch_service')
      .insert([
        { branch_id: 1, service_id: 1 },
        { branch_id: 1, service_id: 2 },
        { branch_id: 2, service_id: 4 },
        { branch_id: 2, service_id: 1 },
        { branch_id: 2, service_id: 3 },
        { branch_id: 2, service_id: 5 },
      ])
  }
}
