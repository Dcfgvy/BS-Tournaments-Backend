import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from 'src/payments/services/purchases/purchases.service';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PurchaseResponseDto } from 'src/payments/dtos/PurchaseResponse.dto';
import { CreationDatesDto } from 'src/utils/dtos';
import { PaginationParamsDto } from 'src/other/pagination/pagination.dto';
import { User } from 'src/database/entities/User.entity';

describe('PurchasesController', () => {
  let controller: PurchasesController;
  let service: PurchasesService;

  const mockPurchasesService = {
    fetchAllPurchases: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [
        {
          provide: PurchasesService,
          useValue: mockPurchasesService,
        },
      ],
    })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PurchasesController>(PurchasesController);
    service = module.get<PurchasesService>(PurchasesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPurchases', () => {
    it('should return a paginated list of purchases', async () => {
      const mockPaginationResult: Pagination<PurchaseResponseDto> = {
        items: [
          {
            id: 1,
            type: 'premium',
            cost: 100,
            user: { id: 25, tag: '#TESTUSER' } as User,
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

      mockPurchasesService.fetchAllPurchases.mockResolvedValue(mockPaginationResult);

      const paginationParams: PaginationParamsDto = { page: 1, limit: 10 };
      const creationDates: CreationDatesDto = { createdFrom: null, createdTo: null };
      const userId = 25;

      const result = await controller.getAllPurchases(creationDates, userId, paginationParams);

      expect(result).toEqual(mockPaginationResult);
      expect(mockPurchasesService.fetchAllPurchases).toHaveBeenCalledWith(
        paginationParams,
        userId,
        null,
        null,
      );
    });

    it('should call the service with the correct filters', async () => {
      const paginationParams: PaginationParamsDto = { page: 2, limit: 5 };
      const creationDates: CreationDatesDto = {
        createdFrom: new Date('2024-03-04T00:00:00.000Z'),
        createdTo: new Date('2024-04-05T00:00:00.000Z'),
      };
      const userId = null;

      await controller.getAllPurchases(creationDates, userId, paginationParams);

      expect(mockPurchasesService.fetchAllPurchases).toHaveBeenCalledWith(
        paginationParams,
        userId,
        creationDates.createdFrom,
        creationDates.createdTo,
      );
    });

    it('should handle missing filters gracefully', async () => {
      const paginationParams: PaginationParamsDto = { page: 1, limit: 10 };
      const creationDates: CreationDatesDto = {};
      const userId = null;

      await controller.getAllPurchases(creationDates, userId, paginationParams);

      expect(mockPurchasesService.fetchAllPurchases).toHaveBeenCalledWith(
        paginationParams,
        userId,
        undefined,
        undefined,
      );
    });

    it('should throw an error if the service fails', async () => {
      mockPurchasesService.fetchAllPurchases.mockRejectedValue(
        new Error('Service failed'),
      );

      const paginationParams: PaginationParamsDto = { page: 1, limit: 10 };
      const creationDates: CreationDatesDto = {};
      const userId = null;

      await expect(
        controller.getAllPurchases(creationDates, userId, paginationParams),
      ).rejects.toThrow('Service failed');
    });
  });
});
