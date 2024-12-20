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
import { PurchasesController } from './controllers/purchases/purchases.controller';
import { PurchasesService } from './services/purchases/purchases.service';
import { Purchase } from 'src/database/entities/payments/Purchase.entity';
import { User } from 'src/database/entities/User.entity';
import { Tournament } from 'src/database/entities/Tournament.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentMethod, Withdrawal, WithdrawalMethod, Purchase, User, Tournament]),
  ],
  controllers: [PaymentsController, WithdrawalsController, WebhooksController, PurchasesController],
  providers: [PaymentsService, WithdrawalsService, CryptoBotService, PurchasesService]
})
export class PaymentsModule {}
