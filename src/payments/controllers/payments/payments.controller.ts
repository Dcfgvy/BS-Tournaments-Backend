import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/User.entity';
import { PaymentBaseDto } from 'src/payments/dtos/PaymentBase.dto';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PaymentsService } from 'src/payments/services/payments/payments.service';
import { CreatePaymentMethodDto } from 'src/payments/dtos/CreatePaymentMethod.dto';
import { UpdatePaymentMethodDto } from 'src/payments/dtos/UpdatePaymentMethod.dto';
import { ApiPagination } from 'src/other/pagination/api-pagination.decorator';
import { PaymentResponseDto } from 'src/payments/dtos/PaymentResponse.dto';
import { CreationDatesDto } from 'src/utils/dtos';
import { PaginationParamsDto } from 'src/other/pagination/pagination.dto';
import { PaginationParams } from 'src/other/pagination/pagination.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserInterceptor } from 'src/users/interceptors/user.interceptor';

@Controller('payments')
@ApiTags('Payments (Top-ups)')
@ApiBearerAuth()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  @UseInterceptors(UserInterceptor)
  @ApiQuery({ name: 'userId', required: false, type: Number, example: 25 })
  @ApiQuery({ name: 'method', required: false, type: String, example: 'crypto-bot' })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, example: '2024-03-04T00:00:00.000Z' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, example: '2024-04-05T00:00:00.000Z' })
  @ApiPagination()
  @ApiOkResponse({ type: Pagination<PaymentResponseDto> })
  async getAllPayments(
    @Query() creationDates: CreationDatesDto,
    @Query('userId') userId: number,
    @Query('method') methodName: string,
    @PaginationParams() paginationParams: PaginationParamsDto,
  ): Promise<Pagination<PaymentResponseDto>> {
    const { createdFrom, createdTo } = creationDates;
    const payments: unknown = await this.paymentsService.fetchPayments(
      paginationParams,
      userId,
      methodName,
      createdFrom,
      createdTo,
    );
    return payments as Pagination<PaymentResponseDto>;
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @ApiQuery({ name: 'method', required: false, type: String, example: 'crypto-bot' })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, example: '2024-03-04T00:00:00.000Z' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, example: '2024-04-05T00:00:00.000Z' })
  @ApiPagination()
  @ApiOkResponse({ type: Pagination<PaymentResponseDto> })
  async getUserPayments(
    @Query() creationDates: CreationDatesDto,
    @Query('method') methodName: string,
    @PaginationParams() paginationParams: PaginationParamsDto,
    @GetUser() user: User,
  ): Promise<Pagination<PaymentResponseDto>> {
    const { createdFrom, createdTo } = creationDates;
    const payments: unknown = await this.paymentsService.fetchPayments(
      paginationParams,
      user.id,
      methodName,
      createdFrom,
      createdTo,
    );
    return payments as Pagination<PaymentResponseDto>;
  }

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
