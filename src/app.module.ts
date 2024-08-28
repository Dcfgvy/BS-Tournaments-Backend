import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { BrawlStarsApiService } from './services/brawl-stars-api/brawl-stars-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { appConfig } from './utils/appConfigs';
import { ThrottlerModule } from '@nestjs/throttler';
import { User } from './typeorm/entities/User.entity';
import { UploadsModule } from './uploads/uploads.module';
import { TournamentSubscriber } from './typeorm/subscribers/TournamentSubscriber';
import { PaginationService } from './services/pagination/pagination.service';

@Module({
  imports: [
    UsersModule, AccountModule, AdminModule, PaymentsModule, TournamentsModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      username: appConfig.DB_USER,
      password: appConfig.DB_PASS,
      database: appConfig.DB_NAME,
      entities: [path.join(__dirname, 'typeorm', 'entities', '*.entity{.ts,.js}')],
      synchronize: true,
      subscribers: [TournamentSubscriber]
    }),
    TypeOrmModule.forFeature([User]),
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 3,
    }]),
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, BrawlStarsApiService, PaginationService],
})
export class AppModule {}
