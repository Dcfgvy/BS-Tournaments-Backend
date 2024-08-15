import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { ProcessModule } from './process/process.module';

@Module({
  providers: [TournamentsService],
  controllers: [TournamentsController],
  imports: [ProcessModule]
})
export class TournamentsModule {}
