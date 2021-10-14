import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Request from 'App/Models/Request'
import { DateTime } from 'luxon'

export default class RequestSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Request.createMany([
      {
        bikeBrand: 'Trek',
        bikeColor: 'Azul',
        bikeModel: 'Xcaliber 18',
        bikeWheelSize: 27,
        bikeObservation: 'Ninguna',
        requestCode: '310821ABC',
        requestTotal: 100,
        clientName: 'Daniel',
        clientLastName: 'Zeballos Suarez',
        clientPhone: '78066791',
        personalId: 3,
        companyId: 2,
        branchId: 2,
        requestDeliveryDateTime: DateTime.now(),
      },
      {
        bikeBrand: 'Marin',
        bikeColor: 'Negro',
        bikeModel: 'Pro 29',
        bikeWheelSize: 29,
        bikeObservation: 'Ninguna',
        requestCode: '310821ABCDE',
        requestTotal: 150,
        clientName: 'Josefino',
        clientLastName: 'Zeballos Suarez',
        clientPhone: '7878798798',
        personalId: 3,
        companyId: 2,
        branchId: 2,
        requestDeliveryDateTime: DateTime.now(),
      },
    ])
  }
}
