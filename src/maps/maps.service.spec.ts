import { Test, TestingModule } from '@nestjs/testing';
import { EventMapsService } from './maps.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventMap } from '../database/entities/EventMap.entity';

describe('EventMapsService', () => {
  let service: EventMapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventMapsService,
        {
          provide: getRepositoryToken(EventMap),
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<EventMapsService>(EventMapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
