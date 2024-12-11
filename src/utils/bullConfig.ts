import Redis from "ioredis";
import { appConfig } from "./appConfigs";

export const bullConfig = {
  connection: new Redis(appConfig.REDIS_URL, { maxRetriesPerRequest: null })
};