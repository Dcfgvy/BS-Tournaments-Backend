import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoBotService } from '../crypto-bot/crypto-bot.service';
import { Repository } from 'typeorm';
import { IPaymentService } from 'src/payments/interfaces/payment-service.interface';
import { User } from 'src/database/entities/User.entity';
import { PaymentStatus } from 'src/payments/enums/payment-status.enum';
import { PaymentMethod } from 'src/database/entities/payments/PaymentMethod.entity';
import { Payment } from 'src/database/entities/payments/Payment.entity';
import { validatePaymentPayload } from 'src/payments/utils/validate-payload.util';
import { CreatePaymentMethodDto } from 'src/payments/dtos/CreatePaymentMethod.dto';
import { UpdatePaymentMethodDto } from 'src/payments/dtos/UpdatePaymentMethod.dto';

@Injectable()
export class PaymentsService {
  private readonly services = new Map<string, IPaymentService>();

  constructor(
    private readonly cryptoBotService: CryptoBotService,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    this.services.set('crypto-bot', this.cryptoBotService);
  }

  private getPaymentService(methodName: string): IPaymentService {
    const service = this.services.get(methodName);
    if(!service) throw new HttpException('Unsupported payment method', HttpStatus.NOT_IMPLEMENTED);
    return service;
  }

  async makePayment(
    methodName: string,
    user: User,
    data: any
  ){
    const method = await this.paymentMethodRepository.findOneBy({ methodName, isActive: true });
    if(!method) throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);

    await validatePaymentPayload(methodName, data);

    // Check the amount
    if(data.amount < method.minAmount || data.amount > method.maxAmount) {
      throw new HttpException('Amount does not meet payment limits', HttpStatus.BAD_REQUEST);
    }

    // Process the Payment
    const payment = this.paymentRepository.create({
      amount: data.amount,
      user: user,
      method: method,
      status: PaymentStatus.PENDING,
    });
    await this.paymentRepository.save(payment);

    const paymentService: IPaymentService = this.getPaymentService(methodName);
    return paymentService.deposit(payment, data);
  }

  getAllPaymentMethods(){
    return this.paymentMethodRepository.find();
  }

  getActivePaymentMethods(){
    return this.paymentMethodRepository.findBy({ isActive: true });
  }

  createPaymentMethod(data: CreatePaymentMethodDto){
    return this.paymentMethodRepository.save({
      ...data,
      names: JSON.stringify(data.names),
      descriptions: JSON.stringify(data.descriptions),
      comission: parseFloat(data.comission),
    });
  }

  updatePaymentMethod(methodId: number, data: UpdatePaymentMethodDto){
    let payload: any = {
      id: methodId,
      ...data
    };
    if(data.names)
      payload.names = JSON.stringify(data.names);
    if(data.descriptions)
      payload.descriptions = JSON.stringify(data.descriptions);
    return this.paymentMethodRepository.save(payload);
  }

  deletePaymentMethod(methodId: number) {
    return this.paymentMethodRepository.delete({ id: methodId });
  }
}
