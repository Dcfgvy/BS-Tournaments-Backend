import { Module } from '@nestjs/common';
import { BrawlersController } from './brawlers.controller';
import { BrawlersService } from './brawlers.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brawler } from '../database/entities/Brawler.entity';

@Module({
  controllers: [BrawlersController],
  providers: [
    BrawlersService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  imports: [
    TypeOrmModule.forFeature([Brawler]),
  ]
})
export class BrawlersModule {}
