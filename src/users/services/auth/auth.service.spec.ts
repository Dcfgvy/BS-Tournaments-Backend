import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { authProviders } from '../../../utils/testingHelpers';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...authProviders
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
