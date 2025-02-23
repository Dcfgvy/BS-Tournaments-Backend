import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { authProviders } from '../../../utils/testingHelpers';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...authProviders,
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
