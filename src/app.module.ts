import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { BrawlStarsApiService } from './services/brawl-stars-api/brawl-stars-api.service';

@Module({
  imports: [AuthModule, AccountModule, AdminModule, PaymentsModule, TournamentsModule],
  controllers: [AppController],
  providers: [AppService, BrawlStarsApiService],
})
export class AppModule {}
