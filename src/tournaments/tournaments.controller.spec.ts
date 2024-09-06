import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tournament } from '../typeorm/entities/Tournament.entity';

describe('TournamentsController', () => {
  let controller: TournamentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentsController],
      providers: [TournamentsService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: {
          }
        }
      ],
    }).compile();

    controller = module.get<TournamentsController>(TournamentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
