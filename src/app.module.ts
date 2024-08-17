import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { BrawlStarsApiService } from './services/brawl-stars-api/brawl-stars-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { appConfig } from './utils/appConfigs';

@Module({
  imports: [
    AuthModule, AccountModule, AdminModule, PaymentsModule, TournamentsModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      username: appConfig.DB_USER,
      password: appConfig.DB_PASS,
      database: appConfig.DB_NAME,
      entities: [path.join(__dirname, 'typeorm', 'entities', '*.entity{.ts,.js}')],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService, BrawlStarsApiService],
})
export class AppModule {}
