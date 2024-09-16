import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsService } from './tournaments.service';
import { Connection } from 'typeorm';
import { mockDbConnection, tournamentsServiceProviders } from '../../../utils/testingHelpers';

describe('TournamentsService', () => {
  let service: TournamentsService;
  let mockConnection: Partial<Connection>;

  beforeEach(async () => {
    mockConnection = { ...mockDbConnection };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...tournamentsServiceProviders,
        {
          provide: Connection,
          useValue: mockConnection,
        }
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
