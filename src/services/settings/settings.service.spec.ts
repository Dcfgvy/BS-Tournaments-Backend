import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Settings } from '../../typeorm/entities/Settings.entity';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(Settings),
          useValue: {
          }
        }
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
