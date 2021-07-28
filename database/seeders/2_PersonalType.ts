import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PersonalType from 'App/Models/PersonalType'

export default class PersonalTypeSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await PersonalType.createMany([
      {
        name: 'Asistente',
        companyId: 1,
      },
      {
        name: 'Mecanico',
        companyId: 1,
      },
      {
        name: 'Propietario',
        companyId: 1,
      },
    ])
  }
}
