import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsService } from './tournaments.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from '../typeorm/entities/Tournament.entity';

describe('TournamentsService', () => {
  let service: TournamentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentsService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: {
          }
        }
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
