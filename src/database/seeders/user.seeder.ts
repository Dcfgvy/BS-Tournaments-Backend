import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { UserRole } from '../../users/enums/role.enum';
import { hashPassword } from '../../utils/bcrypt';
import { appConfig } from '../../utils/appConfigs';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    console.log('Creating organizer...')
    await repository.upsert({
      tag: appConfig.DB_SEED_ORGANIZER_TAG,
      name: 'Organizer',
      password: hashPassword(appConfig.DB_SEED_ORGANIZER_PASSWORD),
      balance: 10000,
      language: 'en',
      ip: 'localhost',
      roles: [UserRole.USER, UserRole.ORGANIZER],
    }, ['tag']);

    console.log('Creating users...')
    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(15);
  }
}
