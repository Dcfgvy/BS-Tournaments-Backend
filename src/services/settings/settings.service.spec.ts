import { Test, TestingModule } from '@nestjs/testing';
import { GlobalSettings } from './settings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Settings } from '../../typeorm/entities/Settings.entity';

describe('GlobalSettings', () => {
  let service: GlobalSettings;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalSettings,
        {
          provide: getRepositoryToken(Settings),
          useValue: {
          }
        }
      ],
    }).compile();

    service = module.get<GlobalSettings>(GlobalSettings);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
