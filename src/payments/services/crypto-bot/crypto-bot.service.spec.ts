import { Test, TestingModule } from '@nestjs/testing';
import { CryptoBotService } from './crypto-bot.service';

describe('CryptoBotService', () => {
  let service: CryptoBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoBotService],
    }).compile();

    service = module.get<CryptoBotService>(CryptoBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
