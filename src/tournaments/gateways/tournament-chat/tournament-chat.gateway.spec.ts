import { Test, TestingModule } from '@nestjs/testing';
import { TournamentChatGateway } from './tournament-chat.gateway';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { dataSourceOptions } from '../../../database/data-source';
import { tournamentsServiceProviders } from '../../../utils/testingHelpers';
import { JwtService } from '@nestjs/jwt';

describe('TournamentChatGateway', () => {
  let gateway: TournamentChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentChatGateway,
        {
          provide: getEntityManagerToken(dataSourceOptions),
          useValue: {},
        },
        ...tournamentsServiceProviders,
        JwtService
      ],
    }).compile();

    gateway = module.get<TournamentChatGateway>(TournamentChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
