import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments/payments.controller';
import { WithdrawalsController } from './controllers/withdrawals/withdrawals.controller';
import { PaymentsService } from './services/payments/payments.service';
import { WithdrawalsService } from './services/withdrawals/withdrawals.service';
import { CryptoBotService } from './services/crypto-bot/crypto-bot.service';

@Module({
  controllers: [PaymentsController, WithdrawalsController],
  providers: [PaymentsService, WithdrawalsService, CryptoBotService]
})
export class PaymentsModule {}
