import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Quote from 'App/Models/Quote'

export default class RequestSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Quote.createMany([
      {
        quoteCode: '123ABC',
        quoteDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit urna id luctus ullamcorper. Cras bibendum sit amet nisl quis convallis. Ut vitae purus sed odio hendrerit pharetra. Phasellus nisi mauris, aliquet ut ultricies sit amet, lacinia non odio. Etiam vestibulum turpis a arcu elementum varius. Nunc libero metus, lobortis quis urna sed, fringilla ultrices quam. Aliquam vestibulum neque eget elementum laoreet. Quisque mattis luctus aliquet. Maecenas ipsum ante, dignissim ac mattis eget, vestibulum eu eros. Cras posuere bibendum elit, in lobortis velit sagittis sed. Maecenas odio justo, varius in aliquam eu, sodales vel orci. Maecenas nec augue nec dolor iaculis mattis.',
        quoteType: '1',
        clientName: 'Daniel',
        clientLastName: 'Zeballos',
        clientAddress: 'Av. Cumavi',
        clientEmail: 'daniel@gmail.com',
        clientPhone: '7806645',
        personalId: 3,
        companyId: 2,
        branchId: 2,
      },
      {
        quoteCode: '1212121sasb',
        quoteDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit urna id luctus ullamcorper. Cras bibendum sit amet nisl quis convallis. Ut vitae purus sed odio hendrerit pharetra. Phasellus nisi mauris, aliquet ut ultricies sit amet, lacinia non odio. Etiam vestibulum turpis a arcu elementum varius. Nunc libero metus, lobortis quis urna sed, fringilla ultrices quam. Aliquam vestibulum neque eget elementum laoreet. Quisque mattis luctus aliquet. Maecenas ipsum ante, dignissim ac mattis eget, vestibulum eu eros. Cras posuere bibendum elit, in lobortis velit sagittis sed. Maecenas odio justo, varius in aliquam eu, sodales vel orci. Maecenas nec augue nec dolor iaculis mattis.',
        quoteType: '1',
        clientName: 'Josefino',
        clientLastName: 'Suarez',
        clientAddress: 'Av. Cumavi',
        clientEmail: 'Josefino@gmail.com',
        clientPhone: '121212121',
        personalId: 3,
        companyId: 2,
        branchId: 2,
      },
    ])
  }
}
