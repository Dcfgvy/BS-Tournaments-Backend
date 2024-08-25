import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/utils/appConfigs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from './services/users/users.service';
import { BrawlStarsApiService } from 'src/services/brawl-stars-api/brawl-stars-api.service';
import { AdminCreationService } from './services/admin-creation/admin-creation.service';

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
