import { appConfig } from '../utils/appConfigs';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: appConfig.DATABASE_URL,
  entities: [path.join(__dirname, 'entities', '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations', '**', '*.{ts,js}')],
  migrationsRun: true,
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);