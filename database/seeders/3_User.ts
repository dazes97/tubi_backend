import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'daniel@gmail.com',
        password: '12345678',
        name: 'Daniel',
        lastName: 'Zeballos',
        gender: '-1',
      },
      {
        email: 'abel@gmail.com',
        password: '12345678',
        name: 'Abel',
        lastName: 'Zeballos',
        gender: '-1',
      },
      {
        email: 'israel@gmail.com',
        password: '12345678',
        name: 'Israel',
        lastName: 'Zeballos',
        gender: '-1',
      },
    ])
  }
}
