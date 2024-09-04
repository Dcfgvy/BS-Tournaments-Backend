import { appConfig } from '../utils/appConfigs';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { TournamentSubscriber } from './subscribers/TournamentSubscriber';
import { SeederOptions } from 'typeorm-extension';


export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: appConfig.DB_HOST,
  port: appConfig.DB_PORT,
  username: appConfig.DB_USER,
  password: appConfig.DB_PASS,
  database: appConfig.DB_NAME,
  entities: [path.join(__dirname, 'entities', '*.entity{.ts,.js}')],
  synchronize: appConfig.isProduction ? false : true,
  subscribers: [TournamentSubscriber],
  factories: [path.join(__dirname, 'factories', '*.factory{.ts,.js}')],
  seeds: [path.join(__dirname, 'seeders', '*.seeder{.ts,.js}')]
};
