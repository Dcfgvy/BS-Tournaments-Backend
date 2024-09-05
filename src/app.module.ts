import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { BrawlStarsApiService } from './services/brawl-stars-api/brawl-stars-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { User } from './typeorm/entities/User.entity';
import { UploadsModule } from './uploads/uploads.module';
import { PaginationService } from './services/pagination/pagination.service';
import { dataSourceOptions } from './typeorm/data-source';
import { appConfig } from './utils/appConfigs';
import { SettingsService } from './services/settings/settings.service';
import { Settings } from './typeorm/entities/Settings.entity';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    UsersModule, AdminModule, PaymentsModule, TournamentsModule, 
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, Settings]),
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: appConfig.isDevelopment ? 10000 : 10,
    }]),
    UploadsModule,
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService, BrawlStarsApiService, PaginationService, SettingsService],
})
export class AppModule {}
