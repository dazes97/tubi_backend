import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Personal from 'App/Models/Personal'

export default class PersonalSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Personal.createMany([
      {
        address: 'Av. Cumavi',
        bornDate: '2021/07/20',
        dni: '11350212',
        companyId: 1,
        personalTypeId: 1,
        branchId: 1,
      },
      {
        address: 'Av. Cumavi',
        bornDate: '2021/07/20',
        dni: '1212122',
        companyId: 2,
        personalTypeId: 1,
        branchId: 1,
      },
      {
        address: 'Av. Cumavi',
        bornDate: '2021/07/20',
        dni: '4121212',
        companyId: 2,
        personalTypeId: 2,
        branchId: 1,
      },
    ])
  }
}
