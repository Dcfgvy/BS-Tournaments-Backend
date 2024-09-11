import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../../typeorm/entities/Event.entity';
import { EventMap } from '../../typeorm/entities/EventMap.entity';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [
    TypeOrmModule.forFeature([Event, EventMap])
  ]
})
export class EventsModule {}
