import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { authProviders } from '../utils/testingHelpers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../database/entities/Event.entity';

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, ...authProviders,
        {
          provide: getRepositoryToken(Event),
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
