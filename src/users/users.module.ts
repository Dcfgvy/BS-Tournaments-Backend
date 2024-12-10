import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AdminCreationService } from './services/admin-creation/admin-creation.service';
import { appConfig } from '../utils/appConfigs';
import { User } from '../database/entities/User.entity';
import { UsersService } from './services/users/users.service';
import { BgUnbanService } from './services/bg-unban/bg-unban.service';
import { BullModule } from '@nestjs/bullmq';
import { BgExpiredTgLinksDeletionService } from './services/bg-expired-tg-links-deletion/bg-expired-tg-links-deletion.service';
import { TelegramConnectionLink } from 'src/database/entities/TelegramConnectionLink.entity';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Global()
@Module({
  controllers: [UsersController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    AdminCreationService,
    UsersService,
    BgUnbanService,
    BgExpiredTgLinksDeletionService,
  ],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, TelegramConnectionLink]),
    JwtModule.register({
      secret: appConfig.JWT_SECRET,
      signOptions: { expiresIn: '1h' }
    }),
    BullModule.registerQueue({
      name: 'brawl-stars-api'
    }),
    TelegramBotModule,
  ],
  exports: [AuthService, UsersService]
})
export class UsersModule {}
