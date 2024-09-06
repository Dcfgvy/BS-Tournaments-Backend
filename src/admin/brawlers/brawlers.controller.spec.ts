import { Test, TestingModule } from '@nestjs/testing';
import { BrawlersController } from './brawlers.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrawlersService } from './brawlers.service';
import { Brawler } from '../../typeorm/entities/Brawler.entity';
import { authProviders } from '../../utils/testingHelpers';

describe('BrawlersController', () => {
  let controller: BrawlersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrawlersController],
      providers: [BrawlersService, ...authProviders,
        {
          provide: getRepositoryToken(Brawler),
          useValue: {
          }
        }
      ]
    }).compile();

    controller = module.get<BrawlersController>(BrawlersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
