import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { Connection, DeepPartial, QueryRunner } from 'typeorm';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { PaymentStatus } from 'src/payments/enums/payment-status.enum';
import { HttpException, Logger } from '@nestjs/common';

describe('WebhooksController', () => {
  let webhooksController: WebhooksController;
  let mockConnection: Partial<Connection>;
  let mockQueryRunner: any;

  // Mocking the Logger methods directly
  const mockLoggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
      },
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as DeepPartial<QueryRunner>;

    mockConnection = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        { provide: Connection, useValue: mockConnection },
      ],
    }).compile();

    webhooksController = module.get<WebhooksController>(WebhooksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleCryptoBotRequest', () => {
    it('should process a valid invoice payment update', async () => {
      const mockUpdate = {
        update_type: 'invoice_paid',
        payload: { payload: JSON.stringify({ paymentId: 1 }) },
      };
      const mockPayment = {
        id: 1,
        status: PaymentStatus.PENDING,
        amount: 100,
        user: { id: 1, balance: 500 },
      };
      const updatedUser = { id: 1, balance: 600 };
      const updatedPayment = { ...mockPayment, status: PaymentStatus.SUCCESS };

      mockQueryRunner.manager.findOne.mockResolvedValue(mockPayment);

      await webhooksController.handleCryptoBotRequest(mockUpdate);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Payment, {
        where: { id: 1, status: PaymentStatus.PENDING },
        relations: ['user'],
      });
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(updatedPayment);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(updatedUser);
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw an error if the payment is not found', async () => {
      const mockUpdate = {
        update_type: 'invoice_paid',
        payload: { payload: JSON.stringify({ paymentId: 1 }) },
      };

      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(
        webhooksController.handleCryptoBotRequest(mockUpdate),
      ).rejects.toThrow(HttpException);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Payment, {
        where: { id: 1, status: PaymentStatus.PENDING },
        relations: ['user'],
      });
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockLoggerError).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should handle unexpected errors and rollback the transaction', async () => {
      const mockUpdate = {
        update_type: 'invoice_paid',
        payload: { payload: JSON.stringify({ paymentId: 1 }) },
      };

      mockQueryRunner.manager.findOne.mockRejectedValue(new Error('Database error'));

      await expect(
        webhooksController.handleCryptoBotRequest(mockUpdate),
      ).rejects.toThrow(HttpException);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Payment, {
        where: { id: 1, status: PaymentStatus.PENDING },
        relations: ['user'],
      });
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockLoggerError).toHaveBeenCalledWith(expect.any(Error));
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should do nothing if update type is not invoice_paid', async () => {
      const mockUpdate = {
        update_type: 'some_other_update',
        payload: { payload: JSON.stringify({ paymentId: 1 }) },
      };

      await webhooksController.handleCryptoBotRequest(mockUpdate);

      expect(mockQueryRunner.connect).not.toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).not.toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
    });
  });
});
