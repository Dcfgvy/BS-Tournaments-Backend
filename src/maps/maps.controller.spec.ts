import { Test, TestingModule } from '@nestjs/testing';
import { EventMapsController } from './maps.controller';
import { EventMapsService } from './maps.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventMap } from '../database/entities/EventMap.entity';
import { authProviders } from '../utils/testingHelpers';

describe('EventMapsController', () => {
  let controller: EventMapsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventMapsController],
      providers: [
        EventMapsService, ...authProviders,
        {
          provide: getRepositoryToken(EventMap),
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<EventMapsController>(EventMapsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
