import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { BrawlersModule } from './brawlers/brawlers.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EventMapsModule } from './maps/maps.module';

@Module({
  imports: [EventsModule, BrawlersModule, EventMapsModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
