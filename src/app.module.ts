import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { BrawlStarsApiService } from './services/brawl-stars-api/brawl-stars-api.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { User } from './typeorm/entities/User.entity';
import { UploadsModule } from './uploads/uploads.module';
import { dataSourceOptions } from './typeorm/data-source';
import { appConfig } from './utils/appConfigs';
import { GlobalSettings } from './services/settings/settings.service';
import { Settings } from './typeorm/entities/Settings.entity';
import { GlobalModule } from './global/global.module';
import { AuthMiddleware } from './users/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { NodeEnv } from './utils/NodeEnv';
import { ImageCleanupSubscriber } from './typeorm/subscribers/image-cleanup.subscriber';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UsersModule, AdminModule, PaymentsModule, TournamentsModule, 
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, Settings]),
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: appConfig.NODE_ENV === NodeEnv.DEV ? undefined : 10,
    }]),
    UploadsModule,
    GlobalModule,
    // JWT Service needed for AuthMiddleware
    JwtModule.register({
      secret: appConfig.JWT_SECRET
    }),
    BullModule.forRoot({
      connection: {
        host: appConfig.REDIS_HOST,
        port: appConfig.REDIS_PORT,
      }
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService, BrawlStarsApiService, GlobalSettings,
    ImageCleanupSubscriber,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
     .apply(AuthMiddleware)
     .exclude(
      { path: 'uploads/(.*)', method: RequestMethod.ALL }
     )
     .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
