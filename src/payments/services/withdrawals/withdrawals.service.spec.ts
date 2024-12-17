import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalsService } from './withdrawals.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptoBotService } from '../crypto-bot/crypto-bot.service';
import { WithdrawalMethod } from 'src/database/entities/payments/WithdrawalMethod.entity';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { WithdrawalStatus } from 'src/payments/enums/withdrawal-status.enum';
import { CreateWithdrawalMethodDto } from 'src/payments/dtos/CreateWithdrawalMethod.dto';
import { UpdateWithdrawalMethodDto } from 'src/payments/dtos/UpdateWithdrawalMethod.dto';
import { CryptoBotWithdrawalDto } from 'src/payments/dtos/CryptoBotWithdrawal.dto';

describe('WithdrawalsService', () => {
  let service: WithdrawalsService;
  let cryptoBotService: CryptoBotService;
  let withdrawalMethodRepository: Repository<WithdrawalMethod>;
  let withdrawalRepository: Repository<Withdrawal>;

  const mockWithdrawalMethodRepository = {
    find: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockWithdrawalRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCryptoBotService = {
    withdraw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalsService,
        {
          provide: getRepositoryToken(WithdrawalMethod),
          useValue: mockWithdrawalMethodRepository,
        },
        {
          provide: getRepositoryToken(Withdrawal),
          useValue: mockWithdrawalRepository,
        },
        {
          provide: CryptoBotService,
          useValue: mockCryptoBotService,
        },
      ],
    }).compile();

    service = module.get<WithdrawalsService>(WithdrawalsService);
    cryptoBotService = module.get<CryptoBotService>(CryptoBotService);
    withdrawalMethodRepository = module.get<Repository<WithdrawalMethod>>(getRepositoryToken(WithdrawalMethod));
    withdrawalRepository = module.get<Repository<Withdrawal>>(getRepositoryToken(Withdrawal));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaymentService', () => {
    it('should return the withdrawal service if it exists', () => {
      const serviceName = 'crypto-bot';
      expect(service['getPaymentService'](serviceName)).toBe(cryptoBotService);
    });

    it('should throw an exception if the withdrawal service does not exist', () => {
      const serviceName = 'invalid-service';
      expect(() => service['getPaymentService'](serviceName)).toThrow(
        new HttpException('Unsupported withdrawal method', HttpStatus.NOT_IMPLEMENTED),
      );
    });
  });

  describe('makeWithdrawal', () => {
    it('should create and process a withdrawal successfully', async () => {
      const methodName = 'crypto-bot';
      const user = { id: 1, balance: 500 } as any;
      const withdrawalData: CryptoBotWithdrawalDto = { amount: 100, telegramUserId: 123456789 };

      const withdrawalMethod = { methodName, isActive: true, minAmount: 50, maxAmount: 200 };
      const createdWithdrawal = { id: 1, ...withdrawalData, user, status: WithdrawalStatus.PENDING };

      mockWithdrawalMethodRepository.findOneBy.mockResolvedValue(withdrawalMethod);
      mockWithdrawalRepository.create.mockReturnValue(createdWithdrawal);
      mockWithdrawalRepository.save.mockResolvedValue(createdWithdrawal);
      mockCryptoBotService.withdraw.mockResolvedValue('success');

      const result = await service.makeWithdrawal(methodName, user, withdrawalData);

      expect(mockWithdrawalMethodRepository.findOneBy).toHaveBeenCalledWith({ methodName, isActive: true });
      expect(mockWithdrawalRepository.create).toHaveBeenCalledWith({
        amount: withdrawalData.amount,
        user,
        method: withdrawalMethod,
        status: WithdrawalStatus.PENDING,
      });
      expect(mockWithdrawalRepository.save).toHaveBeenCalledWith(createdWithdrawal);
      expect(mockCryptoBotService.withdraw).toHaveBeenCalledWith(createdWithdrawal, withdrawalData);
      expect(result).toBe('success');
    });

    it('should throw an exception if the withdrawal method is not found', async () => {
      const methodName = 'non-existent';
      const user = { id: 1, balance: 500 } as any;
      const withdrawalData: CryptoBotWithdrawalDto = { amount: 100, telegramUserId: 123456789 };

      mockWithdrawalMethodRepository.findOneBy.mockResolvedValue(null);

      await expect(service.makeWithdrawal(methodName, user, withdrawalData)).rejects.toThrow(
        new HttpException('Withdrawal method not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if the user has insufficient funds', async () => {
      const methodName = 'crypto-bot';
      const user = { id: 1, balance: 50 } as any;
      const withdrawalData: CryptoBotWithdrawalDto = { amount: 100, telegramUserId: 123456789 };

      const withdrawalMethod = { methodName, isActive: true, minAmount: 50, maxAmount: 200 };

      mockWithdrawalMethodRepository.findOneBy.mockResolvedValue(withdrawalMethod);

      await expect(service.makeWithdrawal(methodName, user, withdrawalData)).rejects.toThrow(
        new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getAllWithdrawalMethods', () => {
    it('should return all withdrawal methods', async () => {
      const methods = [{ id: 1, name: 'Method 1' }, { id: 2, name: 'Method 2' }];
      mockWithdrawalMethodRepository.find.mockResolvedValue(methods);

      const result = await service.getAllWithdrawalMethods();

      expect(mockWithdrawalMethodRepository.find).toHaveBeenCalled();
      expect(result).toBe(methods);
    });
  });

  describe('createWithdrawalMethod', () => {
    it('should create a new withdrawal method', async () => {
      const dto: CreateWithdrawalMethodDto = {
        names: { en: 'Method', ru: 'Метод' },
        descriptions: { en: 'Description', ru: 'Описание' },
        serviceComission: '0.05',
        comission: '0.05',
        imgUrl: 'api/uploads/images/no-image',
        methodName: 'method',
        minAmount: 50,
        maxAmount: 1000,
      };
      const savedMethod = { id: 1, ...dto };

      mockWithdrawalMethodRepository.save.mockResolvedValue(savedMethod);

      const result = await service.createWithdrawalMethod(dto);

      expect(mockWithdrawalMethodRepository.save).toHaveBeenCalledWith({
        ...dto,
        names: JSON.stringify(dto.names),
        descriptions: JSON.stringify(dto.descriptions),
        comission: parseFloat(dto.comission),
      });
      expect(result).toBe(savedMethod);
    });
  });

  describe('updateWithdrawalMethod', () => {
    it('should update a withdrawal method', async () => {
      const methodId = 3;
      const data: UpdateWithdrawalMethodDto = {
        names: { en: 'hello', ru: 'привет' },
        descriptions: { en: 'hello world', ru: 'привет мир' },
        comission: '0.10',
        maxAmount: 25000,
      };
      const savedMethod = { id: methodId, ...data };

      mockWithdrawalMethodRepository.save.mockResolvedValue(savedMethod);

      const result = await service.updateWithdrawalMethod(methodId, data);

      expect(mockWithdrawalMethodRepository.save).toHaveBeenCalledWith({
        ...savedMethod,
        names: JSON.stringify(data.names),
        descriptions: JSON.stringify(data.descriptions),
        comission: parseFloat(data.comission),
      });
      expect(result).toBe(savedMethod);
    });
  });

  describe('deleteWithdrawalMethod', () => {
    it('should call delete method', async () => {
      const methodId = 2;
      mockWithdrawalMethodRepository.delete.mockResolvedValue('success');

      const result = await service.deleteWithdrawalMethod(methodId);

      expect(mockWithdrawalMethodRepository.delete).toHaveBeenCalledWith({
        id: methodId,
      });
      expect(result).toBe('success');
    });
  });
});
