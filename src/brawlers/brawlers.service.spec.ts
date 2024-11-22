import { Test, TestingModule } from '@nestjs/testing';
import { BrawlersService } from './brawlers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Brawler } from '../database/entities/Brawler.entity';

describe('BrawlersService', () => {
  let service: BrawlersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrawlersService,
        {
          provide: getRepositoryToken(Brawler),
          useValue: {
          }
        }
      ],
    }).compile();

    service = module.get<BrawlersService>(BrawlersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
