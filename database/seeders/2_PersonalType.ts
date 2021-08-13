import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PersonalType from 'App/Models/PersonalType'

export default class PersonalTypeSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await PersonalType.createMany([
      { id: 1, name: 'Propietario', companyId: 1 },
      { id: 2, name: 'Asistente', companyId: 1 },
      { id: 3, name: 'Mecanico', companyId: 1 },
    ])
  }
}
