import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments/payments.controller';
import { WithdrawalsController } from './controllers/withdrawals/withdrawals.controller';
import { PaymentsService } from './services/payments/payments.service';
import { WithdrawalsService } from './services/withdrawals/withdrawals.service';
import { CryptoBotService } from './services/crypto-bot/crypto-bot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { WithdrawalMethod } from 'src/database/entities/payments/WithdrawalMethod.entity';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { PaymentMethod } from 'src/database/entities/payments/PaymentMethod.entity';
import { WebhooksController } from './controllers/webhooks/webhooks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentMethod, Withdrawal, WithdrawalMethod]),
  ],
  controllers: [PaymentsController, WithdrawalsController, WebhooksController],
  providers: [PaymentsService, WithdrawalsService, CryptoBotService]
})
export class PaymentsModule {}
