import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class RequestStatusSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Database.insertQuery()
      .table('status_request')
      .insert([
        { id: 0, name: 'Recibido' },
        { id: 1, name: 'Aceptado' },
        { id: 2, name: 'En Proceso' },
        { id: 3, name: 'Finalizado' },
        { id: 4, name: 'Entregado' },
        { id: 5, name: 'Rechazado' },
      ])
  }
}
