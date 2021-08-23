import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
export default class ServicePackageSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('package_service')
      .insert([
        { package_id: 4, service_id: 1 },
        { package_id: 4, service_id: 2 },
        { package_id: 5, service_id: 1 },
        { package_id: 5, service_id: 3 },
      ])
  }
}
