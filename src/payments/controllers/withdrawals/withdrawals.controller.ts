import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/User.entity';
import { PaymentBaseDto } from 'src/payments/dtos/PaymentBase.dto';
import { CreateWithdrawalMethodDto } from 'src/payments/dtos/CreateWithdrawalMethod.dto';
import { WithdrawalsService } from 'src/payments/services/withdrawals/withdrawals.service';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UpdateWithdrawalMethodDto } from 'src/payments/dtos/UpdateWithdrawalMethod.dto';

@Controller('withdrawals')
@ApiTags('Withdrawals')
@ApiBearerAuth()
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService: WithdrawalsService,
  ) {}

  @Get('/methods')
  @UseGuards(AdminGuard)
  getAllWithdrawalMethods(){
    return this.withdrawalsService.getAllWithdrawalMethods();
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
