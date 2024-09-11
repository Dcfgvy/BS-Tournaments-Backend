import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventMap } from '../../typeorm/entities/EventMap.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventMapDto } from './dtos/CreateMap.dto';
import { UpdateEventMapDto } from './dtos/UpdateMap.dto';

@Injectable()
export class EventMapsService {
  constructor(
    @InjectRepository(EventMap)
    private readonly eventMapRepository: Repository<EventMap>
  ) {}

  fetchEventMapById(id: number): Promise<EventMap> {
    return this.eventMapRepository.findOneBy({
      id: id
    });
  }

  fetchAllEventMaps(eventId?: any){
    return this.eventMapRepository.findBy({
      ...(eventId && { eventId: parseInt(eventId) }),
    });
  }

  createEventMap(
    createBrawlerDto: CreateEventMapDto
  ): Promise<any> {
    return this.eventMapRepository.save({
      ...createBrawlerDto
    })
  }

  updateEventMap(
    id: number,
    updateBrawlerDto: UpdateEventMapDto
  ): Promise<any> {
    return this.eventMapRepository.save({
      id,
      ...updateBrawlerDto
    });
  }

  async deleteEventMap(id: number): Promise<any> {
    const eventMap = await this.eventMapRepository.findBy({ id });
    return this.eventMapRepository.remove(eventMap);
  }
}
