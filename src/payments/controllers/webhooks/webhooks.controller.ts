import { Body, Controller, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { User } from 'src/database/entities/User.entity';
import { PaymentStatus } from 'src/payments/enums/payment-status.enum';
import { appConfig } from 'src/utils/appConfigs';
import { Connection } from 'typeorm';

enum CryptoBotUpdateType {
  INVOICE_PAID = 'invoice_paid'
}

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly dbConnection: Connection,
  ) {}

  // Handle Crypto Bot invoice payments
  @ApiExcludeEndpoint()
  @Post(`/${appConfig.CRYPTO_BOT_TOKEN.replace(':', '_')}`)
  async handleCryptoBotRequest(@Body() update: any){
    this.logger.log('Received Crypto Bot invoice payment update:', update);
    if(update.update_type === CryptoBotUpdateType.INVOICE_PAID){
      const paymentId: number = JSON.parse(decodeURIComponent(update.payload.payload)).paymentId;

      const queryRunner = this.dbConnection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try{
        const payment = await queryRunner.manager
          .createQueryBuilder(Payment, 'payment')
          .leftJoinAndSelect('payment.user', 'user')
          .setLock('pessimistic_write')
          .where('payment.id = :paymentId', { paymentId })
          .andWhere('payment.status = :status', { status: PaymentStatus.PENDING })
          .getOne();
        
        if(!payment) throw new Error('Payment not found or not in PENDING status');
        
        const user = payment.user;
        if(!user) throw new Error('User not found for the payment');

        payment.status = PaymentStatus.SUCCESS;
        user.balance += payment.amount;

        await queryRunner.manager.save(payment);
        await queryRunner.manager.save(user);
        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        this.logger.error(err);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      } finally {
        await queryRunner.release();
      }
    }
    else {
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }
  }
}
