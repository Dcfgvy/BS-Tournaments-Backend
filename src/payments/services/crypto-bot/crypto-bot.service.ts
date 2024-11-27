import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { CryptoBotWithdrawalDto } from 'src/payments/dtos/CryptoBotWithdrawal.dto';
import { depositCryptoAmount, withdrawalCryptoAmount } from 'src/payments/functions';
import { IPaymentService } from 'src/payments/interfaces/payment-service.interface';
import { appConfig } from 'src/utils/appConfigs';
import { UrlRedirect } from 'src/utils/other';
import { v4 as uuid } from 'uuid';

type ExchangeRate = {
  is_valid: boolean,
  is_crypto: boolean,
  is_fiat: boolean,
  source: string,
  target: string,
  rate: string,
}

@Injectable()
export class CryptoBotService implements IPaymentService {
  // Crypto Bot has a limit around 1-25000 USD for transfers in any crypto currency
  public minCryptoWithdrawalAmount: number = 0;
  public maxCryptoWithdrawalAmount: number = Infinity;
  private readonly logger = new Logger(CryptoBotService.name);
  
  constructor(){
    try{
      this.getCryptoBotExchangeRates();
    } catch(e) {
      this.logger.error('Error fetching Crypto Bot exchange rates', e);
    }
  }

  async deposit(payment: Payment): Promise<UrlRedirect> {
    const { id, amount, method } = payment;
    const response = await axios({
      method: 'POST',
      url: 'https://pay.crypt.bot/api/createInvoice',
      headers: {
        'Crypto-Pay-API-Token': appConfig.CRYPTO_BOT_TOKEN,
      },
      data: {
        currency_type: "crypto",
        asset: appConfig.CRYPTO_ASSET,
        amount: String(depositCryptoAmount(amount, method.comission)),
        payload: JSON.stringify({ paymentId: id }),
        paid_btn_name: "callback",
        paid_btn_url: "https://google.com",
        allow_comments: false,
        allow_anonymous: false,
        expires_in: 60 * 60 * 24, // 24 hours
      }
    });

    if(response.data?.ok){
      return { url: response.data.result.pay_url };
    }
    throw new HttpException('Error creating invoice', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async withdraw(withdrawal: Withdrawal, payload: CryptoBotWithdrawalDto): Promise<void> {
    const user = withdrawal.user;
    if(!user) throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    const tgId = payload.telegramUserId;

    const amountAfterComission = withdrawalCryptoAmount(withdrawal.amount, withdrawal.method.comission);
    if(amountAfterComission < this.minCryptoWithdrawalAmount || amountAfterComission > this.maxCryptoWithdrawalAmount){
      throw new HttpException('Invalid withdrawal amount', HttpStatus.BAD_REQUEST);
    }

    const spendId = `${user.id}-${new Date().getTime()}-${uuid()}`;
    const response = await axios({
      method: 'POST',
      url: 'https://pay.crypt.bot/api/transfer',
      headers: {
        'Crypto-Pay-API-Token': appConfig.CRYPTO_BOT_TOKEN,
      },
      data: {
        user_id: tgId,
        asset: appConfig.CRYPTO_ASSET,
        amount: amountAfterComission,
        spend_id: spendId,
      }
    });

    if(!response.data?.ok) throw new HttpException('Error making transfer', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'crypto_bot_exchange_rates_fetching'})
  async getCryptoBotExchangeRates(): Promise<ExchangeRate[]> {
    const response = await axios({
      method: 'GET',
      url: 'https://pay.crypt.bot/api/getExchangeRates',
      headers: {
        'Crypto-Pay-API-Token': appConfig.CRYPTO_BOT_TOKEN,
      },
    });

    if(response.data?.ok){
      const rates = response.data.result as Array<ExchangeRate>;
      for(const rate of rates){
        if(
          rate.is_valid
          && rate.is_crypto
          && rate.source === appConfig.CRYPTO_ASSET
          && rate.target === "USD"
        ){
          this.minCryptoWithdrawalAmount = 1 / Number(rate.rate);
          this.maxCryptoWithdrawalAmount = 1 / Number(rate.rate) * 25000;
          break;
        }
      }

      return rates;
    }
  }
}
