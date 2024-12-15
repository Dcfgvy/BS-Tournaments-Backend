import { appConfig } from "src/utils/appConfigs";

export function depositFiatAmount(coins: number, comission: number): number {
  return coins * (1 + Number(comission)) / appConfig.COINS_EXCHANGE_RATE;
}

export function withdrawalFiatAmount(coins: number, comission: number): number {
  return coins * (1 - Number(comission)) / appConfig.COINS_EXCHANGE_RATE;
}