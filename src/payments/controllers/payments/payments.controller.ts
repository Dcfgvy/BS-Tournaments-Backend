import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/User.entity';
import { PaymentBaseDto } from 'src/payments/dtos/PaymentBase.dto';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PaymentsService } from 'src/payments/services/payments/payments.service';
import { CreatePaymentMethodDto } from 'src/payments/dtos/CreatePaymentMethod.dto';
import { UpdatePaymentMethodDto } from 'src/payments/dtos/UpdatePaymentMethod.dto';

@Controller('payments')
@ApiTags('Payments (Top-ups)')
@ApiBearerAuth()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get('/methods')
  @UseGuards(AdminGuard)
  getAllPaymentMethods(){
    return this.paymentsService.getAllPaymentMethods();
  }

  @Get('/methods/active')
  getActivePaymentMethods(){
    return this.paymentsService.getActivePaymentMethods();
  }

  @Post('/methods')
  @UseGuards(AdminGuard)
  createPaymentMethod(@Body() data: CreatePaymentMethodDto){
    return this.paymentsService.createPaymentMethod(data);
  }

  @Patch('/methods/:id')
  @UseGuards(AdminGuard)
  updatePaymentMethod(
    @Param('id', ParseIntPipe) methodId: number,
    @Body() data: UpdatePaymentMethodDto,
  ){
    return this.paymentsService.updatePaymentMethod(methodId, data);
  }

  @Delete('/methods/:id')
  @UseGuards(AdminGuard)
  deletePaymentMethod(
    @Param('id', ParseIntPipe) methodId: number,
  ){
    return this.paymentsService.deletePaymentMethod(methodId);
  }

  @Post('/pay')
  @UseGuards(AuthGuard)
  withdraw(
    @Query('method') methodName: string,
    @GetUser() user: User,
    @Body() data: PaymentBaseDto,
  ){
    return this.paymentsService.makePayment(methodName, user, data);
  }
}
