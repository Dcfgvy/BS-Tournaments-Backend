import { Test, TestingModule } from '@nestjs/testing';
import { BgUnbanService } from './bg-unban.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User.entity';

describe('BgUnbanService', () => {
  let service: BgUnbanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BgUnbanService,
        {
          provide: getRepositoryToken(User),
          useValue: {
          }
        }
      ],
    }).compile();

    service = module.get<BgUnbanService>(BgUnbanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
