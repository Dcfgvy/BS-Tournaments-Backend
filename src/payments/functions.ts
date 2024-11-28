import { appConfig } from "src/utils/appConfigs";

export function depositCryptoAmount(coins: number, comission: number): number {
  return coins * (1 + Number(comission)) / appConfig.COINS_EXCHANGE_RATE;
}

export function withdrawalCryptoAmount(coins: number, comission: number): number {
  return coins * (1 - Number(comission)) / appConfig.COINS_EXCHANGE_RATE;
}