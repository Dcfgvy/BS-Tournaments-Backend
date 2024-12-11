import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { BrawlStarsApiService } from './other/brawl-stars-api/brawl-stars-api.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { User } from './database/entities/User.entity';
import { UploadsModule } from './uploads/uploads.module';
import { dataSourceOptions } from './database/data-source';
import { appConfig } from './utils/appConfigs';
import { Settings } from './database/entities/Settings.entity';
import { AuthMiddleware } from './users/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { NodeEnv } from './utils/NodeEnv';
import { ImageCleanupSubscriber } from './database/subscribers/image-cleanup.subscriber';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { TournamentSubscriber } from './database/subscribers/tournament.subscriber';
import { EventsModule } from './events/events.module';
import { BrawlersModule } from './brawlers/brawlers.module';
import { EventMapsModule } from './maps/maps.module';
import { SettingsModule } from './settings/settings.module';
import { TelegramConnectionLink } from './database/entities/TelegramConnectionLink.entity';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { bullConfig } from './utils/bullConfig';

@Module({
  imports: [
    UsersModule, PaymentsModule, TournamentsModule, EventsModule, BrawlersModule, EventMapsModule, 
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, Settings, TelegramConnectionLink]),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: appConfig.NODE_ENV === NodeEnv.DEV ? undefined : 60,
    }]),
    UploadsModule,
    // JWT module needed for AuthMiddleware
    JwtModule.register({
      secret: appConfig.JWT_SECRET,
    }),
    BullModule.forRoot(bullConfig),
    ScheduleModule.forRoot(),
    SettingsModule,
    TelegramBotModule
  ],
  controllers: [AppController],
  providers: [
    AppService, BrawlStarsApiService,
    ImageCleanupSubscriber,
    TournamentSubscriber,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
     .apply(AuthMiddleware)
     .exclude(
      { path: 'uploads/(.*)', method: RequestMethod.GET }
     )
     .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
