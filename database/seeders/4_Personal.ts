import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Personal from 'App/Models/Personal'

export default class PersonalSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Personal.createMany([
      {
        address: 'Av. Cumavi',
        bornDate: '2021/07/20',
        dni: '121212',
        companyId: 1,
        personalTypeId: 1,
      },
      {
        address: 'Av. Cumavi',
        bornDate: '2021/07/20',
        dni: '121212',
        companyId: 1,
        personalTypeId: 1,
      },
    ])
  }
}
