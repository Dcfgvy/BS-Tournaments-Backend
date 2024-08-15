import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { EventsModule } from './events/events.module';
import { BrawlersModule } from './brawlers/brawlers.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule, TournamentsModule, EventsModule, BrawlersModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
