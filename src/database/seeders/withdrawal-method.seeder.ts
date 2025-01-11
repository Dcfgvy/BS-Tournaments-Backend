import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { WithdrawalMethod } from '../entities/payments/WithdrawalMethod.entity';

const items = [
  {
    methodName: 'crypto-bot',
    names: { en: 'Crypto Bot (Telegram)', ru: 'Crypto Bot (Телеграм)' },
    descriptions: {
      en: 'Instant transfer to your preferred Crypto Bot account in Telegram',
      ru: 'Моментальный перевод на предпочитаемый аккаунт Crypto Bot в Телеграм'
    },
    imgUrl: 'api/uploads/images/crypto-bot.jpg',
    minAmount: 100,
    maxAmount: 100000,
    comission: 0.05,
    serviceComission: 0,
  },
]

export default class WithdrawalMethodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    const repository = dataSource.getRepository(WithdrawalMethod);

    console.log('Creating withdrawal methods...');
    for(const item of items){
      await repository.upsert({
        ...item,
        names: item.names,
        descriptions: item.descriptions,
      }, ['methodName']);
    }
  }
}
