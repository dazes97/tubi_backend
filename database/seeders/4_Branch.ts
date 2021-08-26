import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Branch from 'App/Models/Branch'

export default class BranchSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Branch.createMany([
      {
        name: 'Sucursal virge de lujan',
        address: 'Av. Virgen de Lujan N°1221',
        description: 'La mejor sucursal de santa cruz',
        attentionCapacity: 100,
        lat: '-17.840567787987716',
        lng: '-63.1819047935612',
        status: 1,
        type: 0,
        companyId: 2,
      },
      {
        name: 'Sucursal Av. cumavi',
        address: 'Av. Cumavi  N°112221',
        description: 'La mejor sucursal de santa cruz',
        attentionCapacity: 150,
        lat: '-17.840567787987716',
        lng: '-63.1819047935612',
        status: 1,
        type: 0,
        companyId: 2,
      },
    ])
  }
}
