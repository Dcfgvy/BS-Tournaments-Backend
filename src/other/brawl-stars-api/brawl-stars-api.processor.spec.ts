import { Test, TestingModule } from '@nestjs/testing';
import { BrawlStarsApiService } from './brawl-stars-api.processor';

describe('BrawlStarsApiService', () => {
  let service: BrawlStarsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrawlStarsApiService],
    }).compile();

    service = module.get<BrawlStarsApiService>(BrawlStarsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
