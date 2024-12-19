import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptoBotService } from '../crypto-bot/crypto-bot.service';
import { PaymentMethod } from 'src/database/entities/payments/PaymentMethod.entity';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaymentStatus } from 'src/payments/enums/payment-status.enum';
import { CreatePaymentMethodDto } from 'src/payments/dtos/CreatePaymentMethod.dto';
import { UpdatePaymentMethodDto } from 'src/payments/dtos/UpdatePaymentMethod.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let cryptoBotService: CryptoBotService;
  let paymentMethodRepository: Repository<PaymentMethod>;
  let paymentRepository: Repository<Payment>;

  const mockPaymentMethodRepository = {
    find: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockPaymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCryptoBotService = {
    deposit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(PaymentMethod),
          useValue: mockPaymentMethodRepository,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: CryptoBotService,
          useValue: mockCryptoBotService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    cryptoBotService = module.get<CryptoBotService>(CryptoBotService);
    paymentMethodRepository = module.get<Repository<PaymentMethod>>(getRepositoryToken(PaymentMethod));
    paymentRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaymentService', () => {
    it('should return the payment service if it exists', () => {
      const serviceName = 'crypto-bot';
      expect(service['getPaymentService'](serviceName)).toBe(cryptoBotService);
    });

    it('should throw an exception if the payment service does not exist', () => {
      const serviceName = 'invalid-service';
      expect(() => service['getPaymentService'](serviceName)).toThrow(
        new HttpException('Unsupported payment method', HttpStatus.NOT_IMPLEMENTED),
      );
    });
  });

  describe('makePayment', () => {
    it('should create and process a payment successfully', async () => {
      const methodName = 'crypto-bot';
      const user = { id: 1, name: 'User' } as any;
      const paymentData = { amount: 100 };

      const paymentMethod = { methodName, isActive: true, minAmount: 50, maxAmount: 200 };
      const createdPayment = { id: 1, ...paymentData, user, status: PaymentStatus.PENDING };

      mockPaymentMethodRepository.findOneBy.mockResolvedValue(paymentMethod);
      mockPaymentRepository.create.mockReturnValue(createdPayment);
      mockPaymentRepository.save.mockResolvedValue(createdPayment);
      mockCryptoBotService.deposit.mockResolvedValue('success');

      const result = await service.makePayment(methodName, user, paymentData);

      expect(mockPaymentMethodRepository.findOneBy).toHaveBeenCalledWith({ methodName, isActive: true });
      expect(mockPaymentRepository.create).toHaveBeenCalledWith({
        amount: paymentData.amount,
        user,
        method: paymentMethod,
        status: PaymentStatus.PENDING,
      });
      expect(mockPaymentRepository.save).toHaveBeenCalledWith(createdPayment);
      expect(mockCryptoBotService.deposit).toHaveBeenCalledWith(createdPayment, paymentData);
      expect(result).toBe('success');
    });

    it('should throw an exception if the payment method is not found', async () => {
      const methodName = 'non-existent';
      const user = { id: 1, name: 'User' } as any;
      const paymentData = { amount: 100 };

      mockPaymentMethodRepository.findOneBy.mockResolvedValue(null);

      await expect(service.makePayment(methodName, user, paymentData)).rejects.toThrow(
        new HttpException('Payment method not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getAllPaymentMethods', () => {
    it('should return all payment methods', async () => {
      const methods = [{ id: 1, name: 'Method 1' }, { id: 2, name: 'Method 2' }];
      mockPaymentMethodRepository.find.mockResolvedValue(methods);

      const result = await service.getAllPaymentMethods();

      expect(mockPaymentMethodRepository.find).toHaveBeenCalled();
      expect(result).toBe(methods);
    });
  });

  describe('createPaymentMethod', () => {
    it('should create a new payment method', async () => {
      const dto: CreatePaymentMethodDto = {
        names: { en: 'Method', ru: 'Метод' },
        descriptions: { en: 'Description', ru: 'Описание' },
        serviceComission: '0.05',
        comission: '0.05',
        imgUrl: 'api/uploads/images/no-image',
        methodName: 'method',
        minAmount: 50,
        maxAmount: 1000
      };
      const savedMethod = { id: 1, ...dto };

      mockPaymentMethodRepository.save.mockResolvedValue(savedMethod);

      const result = await service.createPaymentMethod(dto);

      expect(mockPaymentMethodRepository.save).toHaveBeenCalledWith({
        ...dto,
        names: JSON.stringify(dto.names),
        descriptions: JSON.stringify(dto.descriptions),
        comission: parseFloat(dto.comission),
      });
      expect(result).toBe(savedMethod);
    });
  });

  // Additional test cases for updatePaymentMethod and deletePaymentMethod can be added similarly
  describe('updatePaymentMethod', () => {
    it('should update a payment method', async () => {
      const methodId = 3;
      const data: UpdatePaymentMethodDto = {
        names: { en: 'hello', ru: 'привет'},
        descriptions: { en: 'hello world', ru: 'привет мир'},
        comission: '0.10',
        maxAmount: 25000
      };
      const savedMethod = { id: methodId, ...data };

      mockPaymentMethodRepository.save.mockResolvedValue(savedMethod);

      const result = await service.updatePaymentMethod(methodId, data);

      expect(mockPaymentMethodRepository.save).toHaveBeenCalledWith({
        ...savedMethod,
        names: JSON.stringify(data.names),
        descriptions: JSON.stringify(data.descriptions),
        comission: parseFloat(data.comission),
      });
      expect(result).toBe(savedMethod);
    });
  });

  describe('deletePaymentMethod', () => {
    it('should call delete method', async () => {
      const methodId = 2;
      mockPaymentMethodRepository.delete.mockResolvedValue('success');

      const result = await service.deletePaymentMethod(methodId);

      expect(mockPaymentMethodRepository.delete).toHaveBeenCalledWith({
        id: methodId
      });
      expect(result).toBe('success');
    })
  })
});
