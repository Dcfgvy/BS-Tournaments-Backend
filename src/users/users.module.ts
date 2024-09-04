import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from './services/users/users.service';
import { AdminCreationService } from './services/admin-creation/admin-creation.service';
import { appConfig } from '../utils/appConfigs';
import { User } from '../typeorm/entities/User.entity';
import { BrawlStarsApiService } from '../services/brawl-stars-api/brawl-stars-api.service';

@Global()
@Module({
  controllers: [UsersController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    UsersService,
    BrawlStarsApiService,
    AdminCreationService
  ],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: appConfig.JWT_SECRET
    })
  ],
  exports: [AuthService]
})
export class UsersModule {}
