import { Module } from '@nestjs/common';
import { EventMapsController } from './maps.controller';
import { EventMapsService } from './maps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../../typeorm/entities/Event.entity';
import { EventMap } from '../../typeorm/entities/EventMap.entity';

@Module({
  controllers: [EventMapsController],
  providers: [EventMapsService],
  imports: [
    TypeOrmModule.forFeature([Event, EventMap])
  ]
})
export class EventMapsModule {}
