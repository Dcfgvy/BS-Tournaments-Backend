import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from 'src/payments/services/withdrawals/withdrawals.service';
import { CreateWithdrawalMethodDto } from 'src/payments/dtos/CreateWithdrawalMethod.dto';
import { UpdateWithdrawalMethodDto } from 'src/payments/dtos/UpdateWithdrawalMethod.dto';
import { PaymentBaseDto } from 'src/payments/dtos/PaymentBase.dto';
import { User } from 'src/database/entities/User.entity';
import { authProviders } from 'src/utils/testingHelpers';

describe('WithdrawalsController', () => {
  let withdrawalsController: WithdrawalsController;

  const mockWithdrawalsService = {
    getAllWithdrawalMethods: jest.fn(),
    getActiveWithdrawalMethods: jest.fn(),
    createWithdrawalMethod: jest.fn(),
    updateWithdrawalMethod: jest.fn(),
    deleteWithdrawalMethod: jest.fn(),
    makeWithdrawal: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawalsController],
      providers: [
        {
          provide: WithdrawalsService,
          useValue: mockWithdrawalsService,
        },
        ...authProviders,
      ],
    }).compile();

    withdrawalsController = module.get<WithdrawalsController>(WithdrawalsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllWithdrawalMethods', () => {
    it('should return all withdrawal methods', async () => {
      const result = [{ id: 1, name: 'Bank Transfer' }];
      mockWithdrawalsService.getAllWithdrawalMethods.mockResolvedValue(result);

      expect(await withdrawalsController.getAllWithdrawalMethods()).toBe(result);
      expect(mockWithdrawalsService.getAllWithdrawalMethods).toHaveBeenCalledTimes(1);
    });
  });

  describe('getActiveWithdrawalMethods', () => {
    it('should return active withdrawal methods', async () => {
      const result = [{ id: 2, name: 'PayPal' }];
      mockWithdrawalsService.getActiveWithdrawalMethods.mockResolvedValue(result);

      expect(await withdrawalsController.getActiveWithdrawalMethods()).toBe(result);
      expect(mockWithdrawalsService.getActiveWithdrawalMethods).toHaveBeenCalledTimes(1);
    });
  });

  describe('createWithdrawalMethod', () => {
    it('should create a withdrawal method', async () => {
      const createDto: CreateWithdrawalMethodDto = {
        names: { en: 'Bank Transfer', ru: 'Банковский перевод' },
        descriptions: { en: 'Direct bank transfer', ru: 'Прямой банковский перевод' },
        imgUrl: 'api/uploads/images/bank-transfer.png',
        minAmount: 50,
        maxAmount: 5000,
        comission: '0.05',
        methodName: 'bank-transfer',
      };
      const result = { id: 1, ...createDto };
      mockWithdrawalsService.createWithdrawalMethod.mockResolvedValue(result);

      expect(await withdrawalsController.createWithdrawalMethod(createDto)).toBe(result);
      expect(mockWithdrawalsService.createWithdrawalMethod).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateWithdrawalMethod', () => {
    it('should update a withdrawal method', async () => {
      const updateDto: UpdateWithdrawalMethodDto = {
        comission: '0.10',
        imgUrl: 'api/uploads/images/updated.png',
      };
      const methodId = 1;
      const result = { id: methodId, ...updateDto };
      mockWithdrawalsService.updateWithdrawalMethod.mockResolvedValue(result);

      expect(await withdrawalsController.updateWithdrawalMethod(methodId, updateDto)).toBe(result);
      expect(mockWithdrawalsService.updateWithdrawalMethod).toHaveBeenCalledWith(methodId, updateDto);
    });
  });

  describe('deleteWithdrawalMethod', () => {
    it('should delete a withdrawal method', async () => {
      const methodId = 45;
      const result = { success: true };
      mockWithdrawalsService.deleteWithdrawalMethod.mockResolvedValue(result);

      expect(await withdrawalsController.deleteWithdrawalMethod(methodId)).toBe(result);
      expect(mockWithdrawalsService.deleteWithdrawalMethod).toHaveBeenCalledWith(methodId);
    });
  });

  describe('withdraw', () => {
    it('should process a withdrawal', async () => {
      const methodName = 'Bank Transfer';
      const user = new User();
      user.id = 1;
      user.name = 'Jane Doe';
      const withdrawalDto: PaymentBaseDto = { amount: 300 };
      const result = { success: true };
      mockWithdrawalsService.makeWithdrawal.mockResolvedValue(result);

      expect(await withdrawalsController.withdraw(methodName, user, withdrawalDto)).toBe(result);
      expect(mockWithdrawalsService.makeWithdrawal).toHaveBeenCalledWith(methodName, user, withdrawalDto);
    });
  });
});
