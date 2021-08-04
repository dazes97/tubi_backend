import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'daniel@gmail.com',
        password: 'secret',
        name: 'Daniel',
        last_name: 'Zeballos',
      },
      {
        email: 'roman@gmail.com',
        password: 'secet',
        name: 'Roman',
        last_name: 'Gomez',
      },
    ])
  }
}
