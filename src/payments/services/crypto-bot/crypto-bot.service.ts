import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { User } from 'src/database/entities/User.entity';
import { CryptoBotWithdrawalDto } from 'src/payments/dtos/CryptoBotWithdrawal.dto';
import { WithdrawalStatus } from 'src/payments/enums/withdrawal-status.enum';
import { depositCryptoAmount, withdrawalCryptoAmount } from 'src/payments/functions';
import { IPaymentService } from 'src/payments/interfaces/payment-service.interface';
import { appConfig } from 'src/utils/appConfigs';
import { UrlRedirect } from 'src/utils/other';
import { Connection, Repository } from 'typeorm';
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
  public readonly cryptoBotUrl: string = appConfig.isProduction ? 'https://pay.crypt.bot' : 'https://testnet-pay.crypt.bot'
  
  constructor(
    private readonly dbConnection: Connection,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>
  ){
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
      url: `${this.cryptoBotUrl}/api/createInvoice`,
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
      return { url: response.data.result.bot_invoice_url };
    }
    throw new HttpException('Error creating invoice', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async withdraw(withdrawal: Withdrawal, payload: CryptoBotWithdrawalDto): Promise<void> {
    const user = withdrawal.user;
    if(!user) throw new HttpException('No user passed', HttpStatus.INTERNAL_SERVER_ERROR);

    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const lockedUser = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
        lock: { mode: 'pessimistic_write' },
      });
      if(!lockedUser) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);

      lockedUser.balance -= withdrawal.amount;
      withdrawal.status = WithdrawalStatus.SUCCESS;
      await queryRunner.manager.save(lockedUser);
      await queryRunner.manager.save(withdrawal);

      // the withdrawal process
      const amountAfterComission = withdrawalCryptoAmount(withdrawal.amount, withdrawal.method.comission);
      if(amountAfterComission < this.minCryptoWithdrawalAmount || amountAfterComission > this.maxCryptoWithdrawalAmount){
        throw new HttpException('Invalid withdrawal amount', HttpStatus.BAD_REQUEST);
      }

      const spendId = `${user.id}-${new Date().getTime()}-${uuid()}`;
      const response = await axios({
        method: 'POST',
        url: `${this.cryptoBotUrl}/api/transfer`,
        headers: {
          'Crypto-Pay-API-Token': appConfig.CRYPTO_BOT_TOKEN,
        },
        data: {
          user_id: payload.telegramUserId,
          asset: appConfig.CRYPTO_ASSET,
          amount: amountAfterComission,
          spend_id: spendId,
        }
      });
      if(!response.data?.ok) throw new HttpException('Error making transfer', HttpStatus.INTERNAL_SERVER_ERROR);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.withdrawalRepository.save({ ...withdrawal, status: WithdrawalStatus.CANCELLED });
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'crypto_bot_exchange_rates_fetching'})
  async getCryptoBotExchangeRates(): Promise<ExchangeRate[]> {
    const response = await axios({
      method: 'GET',
      url: `${this.cryptoBotUrl}/api/getExchangeRates`,
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
