import { Test, TestingModule } from '@nestjs/testing';
import { BgTournamentsStatusService } from './bg-tournaments-status.service';

describe('BgTournamentsStatusService', () => {
  let service: BgTournamentsStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BgTournamentsStatusService],
    }).compile();

    service = module.get<BgTournamentsStatusService>(BgTournamentsStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
