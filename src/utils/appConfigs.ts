import * as dotenv from 'dotenv';
import { cleanEnv, bool, port, str, num } from 'envalid';
import { NodeEnv } from './NodeEnv';

dotenv.config();

const envConfig = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'ci', 'test'], default: 'development' }),
  PORT: port(),
  BRAWL_STARS_API_KEY: str(),
  
  DATABASE_URL: str(),
  DB_SEED_USER_PASSWORD: str(),
  DB_SEED_ORGANIZER_TAG: str(),
  DB_SEED_ORGANIZER_PASSWORD: str(),

  REDIS_URL: str(),
  JWT_SECRET: str(),
  ADMIN_TAGNAME: str(),
  ADMIN_PASSWORD: str(),

  TOUR_RECRUITMENT_MAX_TIME: num(),
  TOUR_START_AWAITING_TIME: num(),
  TOUR_PLAYING_MAX_TIME: num(),
  TOUR_FREEZE_TIME: num(),
  ORGANIZER_BAN_TIME: num(),
  TOUR_CREATION_FEE: num(),

  CRYPTO_BOT_TOKEN: str(),
  CRYPTO_BOT_ASSET: str(),
  FIAT_CURRENCY: str(),
  COINS_EXCHANGE_RATE: num(),

  ORGANIZER_FEE: num(),
  TELEGRAM_BOT_TOKEN: str(),
});

// In next config objects put variables after default config if you want to overwrite default values
// for corresponding application mode
const defaultConfig = {
  PORT: 3000,
  REDIS_URL: 'redis://localhost:6379',
  ADMIN_TAGNAME: '#ADMIN',
  TOUR_RECRUITMENT_MAX_TIME: 4,
  TOUR_START_AWAITING_TIME: 0.25,
  TOUR_PLAYING_MAX_TIME: 0.5,
  TOUR_FREEZE_TIME: 1,
  ORGANIZER_BAN_TIME: 24,
  TOUR_CREATION_FEE: 20,
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
