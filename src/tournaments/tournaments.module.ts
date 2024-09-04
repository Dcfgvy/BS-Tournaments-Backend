import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from '../typeorm/entities/Tournament.entity';
import { PaginationService } from '../services/pagination/pagination.service';

@Module({
  providers: [
    TournamentsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
  controllers: [TournamentsController],
  imports: [
    TypeOrmModule.forFeature([Tournament]),
  ]
})
export class TournamentsModule {}
