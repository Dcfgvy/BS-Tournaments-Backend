import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PaymentMethod } from '../entities/payments/PaymentMethod.entity';

const items = [
  {
    methodName: 'crypto-bot',
    names: { en: 'Crypto Bot (Telegram)', ru: 'Crypto Bot (Телеграм)' },
    descriptions: {
      en: 'Instant balance top-up. Just pay the Crypto Bot check',
      ru: 'Моментальное пополнение баланса. Просто оплатите чек Crypto Bot'
    },
    imgUrl: 'api/uploads/images/crypto-bot.jpg',
    minAmount: 10,
    maxAmount: 100000,
    comission: 0,
    serviceComission: 0.03,
  },
]

export default class PaymentMethodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    const repository = dataSource.getRepository(PaymentMethod);

    console.log('Creating payment methods...');
    for(const item of items){
      await repository.upsert({
        ...item,
        names: item.names,
        descriptions: item.descriptions,
      }, ['methodName']);
    }
  }
}
