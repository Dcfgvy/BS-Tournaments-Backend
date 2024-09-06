import { Test, TestingModule } from '@nestjs/testing';
import { AdminCreationService } from './admin-creation.service';
import { User } from '../../../typeorm/entities/User.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AdminCreationService', () => {
  let service: AdminCreationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminCreationService,
        {
          provide: getRepositoryToken(User),
          useValue: {
          }
        }
      ],
    }).compile();

    service = module.get<AdminCreationService>(AdminCreationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
