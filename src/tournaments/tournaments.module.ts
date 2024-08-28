import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PaginationService } from 'src/services/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from 'src/typeorm/entities/Tournament.entity';

@Module({
  providers: [
    TournamentsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    PaginationService,
  ],
  controllers: [TournamentsController],
  imports: [
    TypeOrmModule.forFeature([Tournament]),
  ]
})
export class TournamentsModule {}
