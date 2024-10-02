import { Test, TestingModule } from '@nestjs/testing';
import { TournamentChatGateway } from './tournament-chat.gateway';

describe('TournamentChatGateway', () => {
  let gateway: TournamentChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentChatGateway],
    }).compile();

    gateway = module.get<TournamentChatGateway>(TournamentChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
