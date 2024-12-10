import { Test, TestingModule } from '@nestjs/testing';
import { CryptoBotService } from './crypto-bot.service';
import { Connection, DeepPartial, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { User } from 'src/database/entities/User.entity';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { WithdrawalStatus } from 'src/payments/enums/withdrawal-status.enum';
import { CryptoBotWithdrawalDto } from 'src/payments/dtos/CryptoBotWithdrawal.dto';
import { appConfig } from 'src/utils/appConfigs';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CryptoBotService', () => {
  let service: CryptoBotService;
  let mockConnection: Partial<Connection>;
  let mockQueryRunner: any;
  let mockWithdrawalRepository: any;

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as DeepPartial<QueryRunner>;

    mockConnection = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    mockWithdrawalRepository = {
      save: jest.fn(),
    } as Partial<Repository<Withdrawal>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoBotService,
        {
          provide: getRepositoryToken(Withdrawal),
          useValue: mockWithdrawalRepository,
        },
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<CryptoBotService>(CryptoBotService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deposit', () => {
    it('should create an invoice and return the redirect URL', async () => {
      const payment = { id: 1, amount: 100, method: { comission: 0.05 } } as Payment;
      const botInvoiceUrl = 'https://test-invoice-url.com';

      mockedAxios.post.mockResolvedValue({
        data: { ok: true, result: { bot_invoice_url: botInvoiceUrl } },
      });

      const result = await service.deposit(payment);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${service.cryptoBotUrl}/api/createInvoice`,
        expect.objectContaining({
          amount: '1.05', // Including comission
        }),
        expect.any(Object),
      );
      expect(result.url).toBe(botInvoiceUrl);
    });

    it('should throw an error if the invoice creation fails', async () => {
      const payment = { id: 1, amount: 100, method: { comission: 0.05 } } as Payment;

      mockedAxios.post.mockResolvedValue({
        data: { ok: false },
      });

      await expect(service.deposit(payment)).rejects.toThrow(
        new HttpException('Error creating invoice', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('withdraw', () => {
    it('should process a withdrawal successfully', async () => {
      const withdrawal = {
        id: 1,
        amount: 100,
        user: { id: 1, balance: 200 } as User,
        method: { comission: 0.05 },
        status: WithdrawalStatus.PENDING,
      } as Withdrawal;
      const payload = { amount: 100, telegramUserId: 123456789 };

      mockQueryRunner.manager.findOne.mockResolvedValue(withdrawal.user);
      mockedAxios.post.mockResolvedValue({
        data: { ok: true },
      });

      await service.withdraw(withdrawal, payload);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(User, expect.objectContaining({
        where: { id: withdrawal.user.id },
      }));
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({ balance: 100 }),
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: WithdrawalStatus.SUCCESS }),
      );
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${service.cryptoBotUrl}/api/transfer`,
        expect.objectContaining({
          user_id: payload.telegramUserId,
          amount: 0.95, // After commission
        }),
        expect.any(Object),
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction and cancel withdrawal if an error occurs', async () => {
      const withdrawal = {
        id: 1,
        amount: 100,
        user: { id: 1, balance: 200 } as User,
        method: { comission: 0.05 },
        status: WithdrawalStatus.PENDING,
      } as Withdrawal;
      const payload: CryptoBotWithdrawalDto = { amount: 100, telegramUserId: 123456789 };
    
      mockQueryRunner.manager.findOne.mockResolvedValue(withdrawal.user);
      mockedAxios.post.mockRejectedValue(new Error('Transfer failed'));
    
      await expect(service.withdraw(withdrawal, payload)).rejects.toThrow('Transfer failed');
    
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    
      // Verify that a save call with status: CANCELLED occurred
      const saveCalls = mockWithdrawalRepository.save.mock.calls;
      const saveCallForCancellation = saveCalls.find((call: any) =>
        call[0].status === WithdrawalStatus.CANCELLED,
      );
    
      expect(saveCallForCancellation).toBeDefined();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });    
  });

  describe('getCryptoBotExchangeRates', () => {
    it('should fetch and update the exchange rates', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ok: true,
          result: [
            {
              is_valid: true,
              is_crypto: true,
              is_fiat: false,
              source: appConfig.CRYPTO_ASSET,
              target: 'USD',
              rate: '50000',
            },
          ],
        },
      });

      await service.getCryptoBotExchangeRates();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${service.cryptoBotUrl}/api/getExchangeRates`,
        expect.any(Object),
      );
      expect(service.minCryptoWithdrawalAmount).toBe(0.00002); // 1 / 50000
      expect(service.maxCryptoWithdrawalAmount).toBe(0.5); // 1 / 50000 * 25000
    });
  });
});
