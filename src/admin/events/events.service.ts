import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from '../../typeorm/entities/Event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dtos/CreateEvent.dto';
import { UpdateEventDto } from './dtos/UpdateEvent.dto';
import { UserRole } from '../../users/enums/role.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  fetchActiveEvents(){
    return this.eventRepository.find({ where: { isDisabled: false } });
  }

  async fetchEventById(id: number, userRoles: UserRole[]): Promise<Event> {
    const event = await this.eventRepository.findOneBy({
      id: id
    });
    if(event?.isDisabled && !userRoles.includes(UserRole.ADMIN)) return null;
    return event;
  }

  fetchAllEvents(){
    return this.eventRepository.find();
  }

  createEvent(
    createBrawlerDto: CreateEventDto
  ): Promise<any> {
    return this.eventRepository.save({
      ...createBrawlerDto
    })
  }

  updateEvent(
    id: number,
    updateBrawlerDto: UpdateEventDto
  ): Promise<any> {
    return this.eventRepository.save({
      id,
      ...updateBrawlerDto
    });
  }

  async deleteEvent(id: number): Promise<any> {
    const event = await this.eventRepository.findBy({ id });
    return this.eventRepository.remove(event);
  }
}
