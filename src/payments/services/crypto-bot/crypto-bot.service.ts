import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { User } from 'src/database/entities/User.entity';
import { CryptoBotWithdrawalDto } from 'src/payments/dtos/CryptoBotWithdrawal.dto';
import { WithdrawalStatus } from 'src/payments/enums/withdrawal-status.enum';
import { depositFiatAmount, withdrawalFiatAmount } from 'src/payments/functions';
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
export class CryptoBotService implements IPaymentService, OnModuleInit {
  // Crypto Bot has a limit around 1-25000 USD for transfers in any crypto currency
  private _minCryptoWithdrawalAmount: number = 0;
  private _maxCryptoWithdrawalAmount: number = Infinity;
  private cryptoToFiatToRate: number = Infinity;

  private readonly logger = new Logger(CryptoBotService.name);
  public readonly cryptoBotUrl: string = appConfig.isProduction ? 'https://pay.crypt.bot' : 'https://testnet-pay.crypt.bot'
  
  constructor(
    private readonly dbConnection: Connection,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>
  ) {}

  public get minCryptoWithdrawalAmount(): number {
    return this._minCryptoWithdrawalAmount;
  }
  public get maxCryptoWithdrawalAmount(): number {
    return this._maxCryptoWithdrawalAmount;
  }

  async onModuleInit(): Promise<void> {
    try{
      await this.getCryptoBotExchangeRates();
    } catch(e) {
      this.logger.error('Error fetching Crypto Bot exchange rates', e);
    }
  }

  async deposit(payment: Payment): Promise<UrlRedirect> {
    const { id, amount, method } = payment;
    const response = await axios.post(
      `${this.cryptoBotUrl}/api/createInvoice`,
      {
        currency_type: "crypto",
        asset: appConfig.CRYPTO_BOT_ASSET,
        amount: String(depositFiatAmount(amount, method.comission) / this.cryptoToFiatToRate),
        payload: JSON.stringify({ paymentId: id }),
        paid_btn_name: "callback",
        paid_btn_url: "https://google.com",
        allow_comments: false,
        allow_anonymous: false,
        expires_in: 60 * 60 * 24, // 24 hours
      }, {
        headers: {
          'Crypto-Pay-API-Token': appConfig.CRYPTO_BOT_TOKEN,
        }
      }
    );

    if(response?.data?.ok){
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
      const amountAfterComission = withdrawalFiatAmount(withdrawal.amount, withdrawal.method.comission) / this.cryptoToFiatToRate;
      if(amountAfterComission < this._minCryptoWithdrawalAmount || amountAfterComission > this._maxCryptoWithdrawalAmount){
        throw new HttpException('Invalid withdrawal amount (min 1 USD)', HttpStatus.BAD_REQUEST);
      }

      const spendId = `${user.id}-${new Date().getTime()}-${uuid()}`;
      const response = await axios.post(
        `${this.cryptoBotUrl}/api/transfer`,
        {
          user_id: payload.telegramUserId,
          asset: appConfig.CRYPTO_BOT_ASSET,
          amount: amountAfterComission,
          spend_id: spendId,
        },
        {
          headers: {
            'Crypto-Pay-API-Token': appConfig.CRYPTO_BOT_TOKEN,
          }
        }
      );
      if(!response?.data?.ok) throw new HttpException('Error making transfer', HttpStatus.INTERNAL_SERVER_ERROR);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.withdrawalRepository.save({ ...withdrawal, status: WithdrawalStatus.CANCELLED });
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: 'crypto_bot_exchange_rates_fetching'})
  async getCryptoBotExchangeRates(): Promise<ExchangeRate[]> {
    const response = await axios.get(`${this.cryptoBotUrl}/api/getExchangeRates`, {
      headers: {
        'Crypto-Pay-API-Token': appConfig.CRYPTO_BOT_TOKEN,
      },
    });

    if(response?.data?.ok){
      const rates = response.data.result as Array<ExchangeRate>;
      for(const rate of rates){
        if(
          rate.is_valid
          && rate.is_crypto
          && rate.source === appConfig.CRYPTO_BOT_ASSET
          && rate.target === "USD"
        ){
          this._minCryptoWithdrawalAmount = 1 / Number(rate.rate);
          this._maxCryptoWithdrawalAmount = 1 / Number(rate.rate) * 25000;
        }

        if(
          rate.is_valid
          && rate.is_crypto
          && rate.source === appConfig.CRYPTO_BOT_ASSET
          && rate.target === appConfig.FIAT_CURRENCY
        ){
          this.cryptoToFiatToRate = Number(rate.rate);
        }
      }
      return rates;
    }
  }
}
