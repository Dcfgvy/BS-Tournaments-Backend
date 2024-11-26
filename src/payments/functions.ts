import { appConfig } from "src/utils/appConfigs";

export function depositCryptoAmount(coins: number, comission: number): number {
  return coins * (1 + comission) / appConfig.COINS_EXCHANGE_RATE;
}

export function withdrawalCryptoAmount(coins: number, comission: number): number {
  return coins * (1 - comission) / appConfig.COINS_EXCHANGE_RATE;
}

export function coinsAmount(crypto: number, comissionPaid: number): number {
  return crypto / (1 + comissionPaid) * appConfig.COINS_EXCHANGE_RATE;
}