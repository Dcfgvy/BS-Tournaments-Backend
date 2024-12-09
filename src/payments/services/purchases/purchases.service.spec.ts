import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { PurchasesService } from './purchases.service';
import { Purchase } from 'src/database/entities/payments/Purchase.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/database/entities/User.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('PurchasesService', () => {
  let service: PurchasesService;
  let repository: Repository<Purchase>;
  let mockQueryBuilder: any;
  let mockRepository: Partial<Repository<Purchase>>;

  beforeEach(async () => {
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    } as Partial<QueryBuilder<Purchase>>;
  
    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasesService,
        {
          provide: getRepositoryToken(Purchase),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PurchasesService>(PurchasesService);
    repository = module.get<Repository<Purchase>>(getRepositoryToken(Purchase));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAllPurchases', () => {
    it('should return paginated purchases', async () => {
      const mockPaginationResult: Pagination<Partial<Purchase>> = {
        items: [
          {
            id: 1,
            type: 'premium',
            cost: 100,
            user: { id: 25, tag: '#TESTUSER' } as User,
            createdAt: new Date('2024-03-04T00:00:00.000Z'),
          },
        ],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      (paginate as jest.Mock).mockResolvedValue(mockPaginationResult);

      const paginationOptions = { page: 1, limit: 10 };

      const result = await service.fetchAllPurchases(paginationOptions);

      expect(paginate).toHaveBeenCalledWith(expect.any(Object), paginationOptions);
      expect(result).toEqual(mockPaginationResult);
    });

    it('should apply userId filter if provided', async () => {
      const userId = 25;

      await service.fetchAllPurchases({ page: 1, limit: 10 }, userId);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'purchases.userId = :userId',
        { userId },
      );
    });

    it('should apply createdFrom filter if provided', async () => {
      const createdFrom = new Date('2024-03-01T00:00:00.000Z');

      await service.fetchAllPurchases({ page: 1, limit: 10 }, undefined, createdFrom);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'purchases.createdAt >= :createdFrom',
        { createdFrom },
      );
    });

    it('should apply createdTo filter if provided', async () => {
      const createdTo = new Date('2024-04-01T00:00:00.000Z');

      await service.fetchAllPurchases({ page: 1, limit: 10 }, undefined, undefined, createdTo);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'purchases.createdAt <= :createdTo',
        { createdTo },
      );
    });

    it('should order purchases by createdAt in descending order', async () => {

      await service.fetchAllPurchases({ page: 1, limit: 10 });

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'purchases.createdAt',
        'DESC',
      );
    });

    it('should call paginate with the constructed query and pagination options', async () => {
      const paginationOptions = { page: 2, limit: 5 };

      await service.fetchAllPurchases(paginationOptions);

      expect(paginate).toHaveBeenCalledWith(mockQueryBuilder, paginationOptions);
    });

    it('should handle multiple filters together', async () => {

      const createdFrom = new Date('2024-03-01T00:00:00.000Z');
      const createdTo = new Date('2024-04-01T00:00:00.000Z');
      const userId = 25;

      await service.fetchAllPurchases({ page: 1, limit: 10 }, userId, createdFrom, createdTo);

      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(1, 'purchases.userId = :userId', { userId });
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(2, 'purchases.createdAt >= :createdFrom', { createdFrom });
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(3, 'purchases.createdAt <= :createdTo', { createdTo });
    });
  });
});
