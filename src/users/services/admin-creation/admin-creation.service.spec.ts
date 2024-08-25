import { Test, TestingModule } from '@nestjs/testing';
import { AdminCreationService } from './admin-creation.service';

describe('AdminCreationService', () => {
  let service: AdminCreationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCreationService],
    }).compile();

    service = module.get<AdminCreationService>(AdminCreationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
