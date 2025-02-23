import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventMap } from '../database/entities/EventMap.entity';
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
    return this.eventMapRepository.findOne({
      where: {
        id: id
      },
      relations: ['event']
    });
  }

  fetchAllEventMaps(eventId?: any){
    return this.eventMapRepository.find({
      where: {
        ...(eventId && { eventId: parseInt(eventId) }),
      },
      relations: ['event']
    });
  }

  async createEventMap(
    createEventMapDto: CreateEventMapDto
  ): Promise<any> {
    const mapWithGivenApiName = await this.eventMapRepository.findOneBy({ apiName: createEventMapDto.apiName });
    if(mapWithGivenApiName) throw new HttpException('Api Name is already taken', HttpStatus.CONFLICT);
    return this.eventMapRepository.save({
      ...createEventMapDto,
      names: JSON.stringify(createEventMapDto.names)
    })
  }

  async updateEventMap(
    id: number,
    updateEventMapDto: UpdateEventMapDto
  ): Promise<any> {
    let payload: any = {
      id,
      ...updateEventMapDto
    };
    if(updateEventMapDto.apiName){
      const mapWithGivenApiName = await this.eventMapRepository.findOneBy({ apiName: updateEventMapDto.apiName });
      if(mapWithGivenApiName) throw new HttpException('Api Name is already taken', HttpStatus.CONFLICT);
    }
    if(updateEventMapDto.names)
      payload.names = JSON.stringify(updateEventMapDto.names);
    return this.eventMapRepository.save(payload);
  }

  async deleteEventMap(id: number): Promise<any> {
    const eventMap = await this.eventMapRepository.findBy({ id });
    return this.eventMapRepository.remove(eventMap);
  }
}
