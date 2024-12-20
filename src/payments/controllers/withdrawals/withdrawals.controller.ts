import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/User.entity';
import { PaymentBaseDto } from 'src/payments/dtos/PaymentBase.dto';
import { CreateWithdrawalMethodDto } from 'src/payments/dtos/CreateWithdrawalMethod.dto';
import { WithdrawalsService } from 'src/payments/services/withdrawals/withdrawals.service';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UpdateWithdrawalMethodDto } from 'src/payments/dtos/UpdateWithdrawalMethod.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from 'src/other/pagination/api-pagination.decorator';
import { PaginationParams } from 'src/other/pagination/pagination.decorator';
import { PaginationParamsDto } from 'src/other/pagination/pagination.dto';
import { WithdrawalResponseDto } from 'src/payments/dtos/WithdrawalResponse.dto';
import { UserInterceptor } from 'src/users/interceptors/user.interceptor';
import { CreationDatesDto } from 'src/utils/dtos';

@Controller('withdrawals')
@ApiTags('Withdrawals')
@ApiBearerAuth()
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService: WithdrawalsService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  @UseInterceptors(UserInterceptor)
  @ApiQuery({ name: 'userId', required: false, type: Number, example: 25 })
  @ApiQuery({ name: 'method', required: false, type: String, example: 'crypto-bot' })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, example: '2024-03-04T00:00:00.000Z' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, example: '2024-04-05T00:00:00.000Z' })
  @ApiPagination()
  @ApiOkResponse({ type: Pagination<WithdrawalResponseDto> })
  async getAllWithdrawals(
    @Query() creationDates: CreationDatesDto,
    @Query('userId') userId: number,
    @Query('method') methodName: string,
    @PaginationParams() paginationParams: PaginationParamsDto,
  ): Promise<Pagination<WithdrawalResponseDto>> {
    const { createdFrom, createdTo } = creationDates;
    const withdrawals: unknown = await this.withdrawalsService.fetchWithdrawals(
      paginationParams,
      userId,
      methodName,
      createdFrom,
      createdTo,
    );
    return withdrawals as Pagination<WithdrawalResponseDto>;
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @ApiQuery({ name: 'method', required: false, type: String, example: 'crypto-bot' })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, example: '2024-03-04T00:00:00.000Z' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, example: '2024-04-05T00:00:00.000Z' })
  @ApiPagination()
  @ApiOkResponse({ type: Pagination<WithdrawalResponseDto> })
  async getUserPayments(
    @Query() creationDates: CreationDatesDto,
    @Query('method') methodName: string,
    @PaginationParams() paginationParams: PaginationParamsDto,
    @GetUser() user: User,
  ): Promise<Pagination<WithdrawalResponseDto>> {
    const { createdFrom, createdTo } = creationDates;
    const withdrawals: unknown = await this.withdrawalsService.fetchWithdrawals(
      paginationParams,
      user.id,
      methodName,
      createdFrom,
      createdTo,
    );
    return withdrawals as Pagination<WithdrawalResponseDto>;
  }

  @Get('/methods')
  @UseGuards(AdminGuard)
  getAllWithdrawalMethods(){
    return this.withdrawalsService.getAllWithdrawalMethods();
  }

  // get minimal balance that should be on a specific withdrawal method
  @Get('/methods/min-balance/:id')
  @UseGuards(AdminGuard)
  getMinimalBalanceForWithdrawalMethod(
    @Param('id', ParseIntPipe) methodId: number,
  ){
    return this.withdrawalsService.getMinimalBalanceForWithdrawalMethod(methodId);
  }

  @Get('/methods/active')
  getActiveWithdrawalMethods(){
    return this.withdrawalsService.getActiveWithdrawalMethods();
  }

  @Post('/methods')
  @UseGuards(AdminGuard)
  createWithdrawalMethod(@Body() data: CreateWithdrawalMethodDto){
    return this.withdrawalsService.createWithdrawalMethod(data);
  }

  @Patch('/methods/:id')
  @UseGuards(AdminGuard)
  updateWithdrawalMethod(
    @Param('id', ParseIntPipe) methodId: number,
    @Body() data: UpdateWithdrawalMethodDto,
  ){
    return this.withdrawalsService.updateWithdrawalMethod(methodId, data);
  }

  @Delete('/methods/:id')
  @UseGuards(AdminGuard)
  deleteWithdrawalMethod(
    @Param('id', ParseIntPipe) methodId: number,
  ){
    return this.withdrawalsService.deleteWithdrawalMethod(methodId);
  }

  @Post('/withdraw')
  @UseGuards(AuthGuard)
  withdraw(
    @Query('method') methodName: string,
    @GetUser() user: User,
    @Body() data: PaymentBaseDto,
  ){
    return this.withdrawalsService.makeWithdrawal(methodName, user, data);
  }
}
