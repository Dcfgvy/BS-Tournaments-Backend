import { Test, TestingModule } from '@nestjs/testing';
import { BgTournamentsStatusService } from './bg-tournaments-status.service';
import { UsersService } from '../../../users/services/users/users.service';
import { Connection } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../database/entities/User.entity';
import { mockDbConnection, tournamentsServiceProviders } from '../../../utils/testingHelpers';

describe('BgTournamentsStatusService', () => {
  let service: BgTournamentsStatusService;
  let mockConnection: Partial<Connection>;

  beforeEach(async () => {
    mockConnection = { ...mockDbConnection };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BgTournamentsStatusService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
          }
        },
        ...tournamentsServiceProviders,
        {
          provide: Connection,
          useValue: mockConnection,
        }
      ],
    }).compile();

    service = module.get<BgTournamentsStatusService>(BgTournamentsStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
