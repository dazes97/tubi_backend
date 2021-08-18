import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Service from 'App/Models/Service'

export default class ServiceSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Service.createMany([
      {
        name: 'Ajuste de Frenos',
        description: 'Ajuste de frenos completo',
        price: 25,
        companyId: 2,
      },
      {
        name: 'Ajuste de Cadena',
        description: 'Ajuste de cadena completo',
        price: 30,
        companyId: 2,
      },
      {
        name: 'Lavado de bicicleta',
        description: 'Lavado de bicicleta completo',
        price: 70,
        companyId: 2,
      },
    ])
  }
}
