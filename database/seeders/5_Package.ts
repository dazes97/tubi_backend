import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Package from 'App/Models/Package'

export default class PackageSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Package.createMany([
      {
        name: 'Paquete Mantenimiento Simple',
        description: 'Mantenimiento simple sino es de uso intensivo',
        price: 50,
        companyId: 2,
      },
      {
        name: 'Paquete mantenimiento preventivo',
        description: 'Ajuste sencillo para prevenir fallas durante una ruta',
        price: 60,
        companyId: 2,
      },
    ])
  }
}
