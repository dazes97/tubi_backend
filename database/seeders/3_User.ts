import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'virk@adonisjs.com',
        password: 'secret',
        name: 'Daniel',
        lastname: 'Zeballos',
      },
      {
        email: 'romain@adonisjs.com',
        password: 'supersecret',
        name: 'Roman',
        lastname: 'Gomez',
      },
    ])
  }
}
