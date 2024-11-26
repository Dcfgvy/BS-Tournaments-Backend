import * as dotenv from 'dotenv';
import { cleanEnv, bool, port, url, str, num } from 'envalid';
import { NodeEnv } from './NodeEnv';

dotenv.config();

const envConfig = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'ci', 'test'], default: 'development' }),
  LOAD_TEST_DATA: bool({ choices: [true, false], default: false }),
  PORT: port(),
  BRAWL_STARS_API_KEY: str(),
  
  DB_HOST: str(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_PASS: str(),
  DB_NAME: str(),
  REDIS_HOST: str(),
  REDIS_PORT: port(),
  DB_SEED_USER_PASSWORD: str(),
  DB_SEED_ORGANIZER_TAG: str(),
  DB_SEED_ORGANIZER_PASSWORD: str(),
  JWT_SECRET: str(),
  ADMIN_TAGNAME: str(),
  ADMIN_PASSWORD: str(),

  TOUR_RECRUITMENT_MAX_TIME: num(),
  TOUR_START_AWAITING_TIME: num(),
  TOUR_PLAYING_MAX_TIME: num(),
  TOUR_FREEZE_TIME: num(),
  ORGANIZER_BAN_TIME: num(),

  PAYOUT_COMMISSION: num(),
  ORGANIZER_FEE: num(),
  CRYPTO_BOT_TOKEN: str(),
  CRYPTO_ASSET: str(),
  COINS_EXCHANGE_RATE: num(),
});

// In next config objects put variables after default config if you want to overwrite default values
// for corresponding application mode
const defaultConfig = {
  LOAD_TEST_DATA: false,
  PORT: 3000,
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  ADMIN_TAGNAME: '#ADMIN',
  TOUR_RECRUITMENT_MAX_TIME: 4,
  TOUR_START_AWAITING_TIME: 0.25,
  TOUR_PLAYING_MAX_TIME: 0.5,
  TOUR_FREEZE_TIME: 72,
  ORGANIZER_BAN_TIME: 48,
  COINS_EXCHANGE_RATE: 100,
};

const devConfig = {
  ...defaultConfig,
  ...envConfig,
};
const ciConfig = {
  ...defaultConfig,
  ...envConfig,
};
const testConfig = {
  ...defaultConfig,
  ...envConfig,
};
const prodConfig = {
  ...defaultConfig,
  ...envConfig,
};

const getAppConfig = () => {
  if (envConfig.NODE_ENV === NodeEnv.DEV) {
    return devConfig;
  } else if (envConfig.NODE_ENV === NodeEnv.TEST) {
    return testConfig;
  } else if (envConfig.NODE_ENV === NodeEnv.CI) {
    return ciConfig;
  } else if (envConfig.NODE_ENV === NodeEnv.PROD) {
    return prodConfig;
  } else {
    throw new Error('Invalid NODE_ENV=' + envConfig.NODE_ENV + ' Must be one of ' + Object.values(NodeEnv));
  }
};

const config = getAppConfig();
export const appConfig = Object.freeze(config);
