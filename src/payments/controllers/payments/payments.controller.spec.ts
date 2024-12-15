import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from 'src/payments/services/payments/payments.service';
import { CreatePaymentMethodDto } from 'src/payments/dtos/CreatePaymentMethod.dto';
import { UpdatePaymentMethodDto } from 'src/payments/dtos/UpdatePaymentMethod.dto';
import { PaymentBaseDto } from 'src/payments/dtos/PaymentBase.dto';
import { User } from 'src/database/entities/User.entity';
import { authProviders } from 'src/utils/testingHelpers';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;

  const mockPaymentsService = {
    getAllPaymentMethods: jest.fn(),
    getActivePaymentMethods: jest.fn(),
    createPaymentMethod: jest.fn(),
    updatePaymentMethod: jest.fn(),
    deletePaymentMethod: jest.fn(),
    makePayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService
        },
        ...authProviders
      ],
    }).compile();

    paymentsController = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPaymentMethods', () => {
    it('should return all payment methods', async () => {
      const result = [{ id: 1, name: 'Credit Card' }];
      mockPaymentsService.getAllPaymentMethods.mockResolvedValue(result);

      expect(await paymentsController.getAllPaymentMethods()).toBe(result);
      expect(mockPaymentsService.getAllPaymentMethods).toHaveBeenCalledTimes(1);
    });
  });

  describe('getActivePaymentMethods', () => {
    it('should return active payment methods', async () => {
      const result = [{ id: 2, name: 'PayPal' }];
      mockPaymentsService.getActivePaymentMethods.mockResolvedValue(result);

      expect(await paymentsController.getActivePaymentMethods()).toBe(result);
      expect(mockPaymentsService.getActivePaymentMethods).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPaymentMethod', () => {
    it('should create a payment method', async () => {
      const createDto: CreatePaymentMethodDto = {
        names: { en: 'Jiji', ru: 'Jiji' },
        descriptions: { en: 'Credit Card', ru: 'Кредитная карта' },
        imgUrl: 'api/uploads/images/credit-card.png',
        minAmount: 10,
        maxAmount: 1000,
        comission: '0.10',
        methodName: 'credit-card',
      };
      const result = { id: 1, ...createDto };
      mockPaymentsService.createPaymentMethod.mockResolvedValue(result);

      expect(await paymentsController.createPaymentMethod(createDto)).toBe(result);
      expect(mockPaymentsService.createPaymentMethod).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update a payment method', async () => {
      const updateDto: UpdatePaymentMethodDto = {
        comission: '0.30',
        imgUrl: 'api/images/hello.png',
      };
      const methodId = 1;
      const result = { id: methodId, ...updateDto };
      mockPaymentsService.updatePaymentMethod.mockResolvedValue(result);

      expect(await paymentsController.updatePaymentMethod(methodId, updateDto)).toBe(result);
      expect(mockPaymentsService.updatePaymentMethod).toHaveBeenCalledWith(methodId, updateDto);
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete a payment method', async () => {
      const methodId = 45;
      const result = { success: true };
      mockPaymentsService.deletePaymentMethod.mockResolvedValue(result);

      expect(await paymentsController.deletePaymentMethod(methodId)).toBe(result);
      expect(mockPaymentsService.deletePaymentMethod).toHaveBeenCalledWith(methodId);
    });
  });

  describe('withdraw', () => {
    it('should process a payment', async () => {
      const methodName = 'PayPal';
      const user = new User();
      user.id = 1;
      user.name = 'John Doe';
      const paymentDto: PaymentBaseDto = { amount: 100 };
      const result = { success: true };
      mockPaymentsService.makePayment.mockResolvedValue(result);

      expect(await paymentsController.withdraw(methodName, user, paymentDto)).toBe(result);
      expect(mockPaymentsService.makePayment).toHaveBeenCalledWith(methodName, user, paymentDto);
    });
  });
});
