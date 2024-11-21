import { appConfig } from '../utils/appConfigs';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: appConfig.DB_HOST,
  port: appConfig.DB_PORT,
  username: appConfig.DB_USER,
  password: appConfig.DB_PASS,
  database: appConfig.DB_NAME,
  entities: [path.join(__dirname, 'entities', '*.entity.{ts,js}')],
  synchronize: appConfig.isProduction ? false : true,
};