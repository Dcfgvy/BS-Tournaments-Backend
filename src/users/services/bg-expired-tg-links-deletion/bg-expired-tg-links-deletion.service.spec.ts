import { Test, TestingModule } from '@nestjs/testing';
import { BgExpiredTgLinksDeletionService } from './bg-expired-tg-links-deletion.service';

describe('BgExpiredTgLinksDeletionService', () => {
  let service: BgExpiredTgLinksDeletionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BgExpiredTgLinksDeletionService],
    }).compile();

    service = module.get<BgExpiredTgLinksDeletionService>(BgExpiredTgLinksDeletionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
