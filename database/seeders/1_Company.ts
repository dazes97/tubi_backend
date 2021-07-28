import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Company from 'App/Models/Company'

export default class CompanySeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Company.createMany([
      {
        name: 'Tu Bicicleta Bolivia',
        nit: '123',
        mainAddress: 'Av. Cumavi',
      },
      {
        name: 'Tu Snake Bike',
        nit: '121212',
        mainAddress: 'Av. Alto San Pedro',
      },
    ])
  }
}
