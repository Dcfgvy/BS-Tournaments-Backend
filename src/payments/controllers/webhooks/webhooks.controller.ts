import { Body, Controller, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Payment } from 'src/database/entities/payments/Payment.entity';
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
  @Post(`/${appConfig.CRYPTO_BOT_TOKEN}`)
  async handleCryptoBotRequest(@Body() update: any){
    if(update.update_type === CryptoBotUpdateType.INVOICE_PAID){
      const paymentId: number = JSON.parse(update.payload.payload).paymentId;

      const queryRunner = this.dbConnection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try{
        const payment = await queryRunner.manager.findOne(Payment, {
          where: { id: paymentId, status: PaymentStatus.PENDING },
          relations: ['user']
        });
        if(!payment) throw new Error('Payment not found');
        const user = payment.user;

        payment.status = PaymentStatus.SUCCESS;
        user.balance += payment.amount;

        await queryRunner.manager.save(payment);
        await queryRunner.manager.save(user);
      } catch (err) {
        await queryRunner.rollbackTransaction();
        this.logger.error(err);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      } finally {
        await queryRunner.release();
      }
    }
  }
}
