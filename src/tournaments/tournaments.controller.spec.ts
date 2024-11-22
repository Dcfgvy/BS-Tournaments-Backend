import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsController } from './tournaments.controller';
import { UsersService } from '../users/services/users/users.service';
import { User } from '../database/entities/User.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { authProviders, mockDbConnection, tournamentsServiceProviders } from '../utils/testingHelpers';

describe('TournamentsController', () => {
  let controller: TournamentsController;
  let mockConnection: Partial<Connection>;

  beforeEach(async () => {
    mockConnection = { ...mockDbConnection };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentsController],
      providers: [
        ...tournamentsServiceProviders,
        ...authProviders,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
          }
        },
        {
          provide: Connection,
          useValue: mockConnection,
        }
      ],
    }).compile();

    controller = module.get<TournamentsController>(TournamentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
