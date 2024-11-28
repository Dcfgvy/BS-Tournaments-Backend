import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/User.entity';
import { PaymentBaseDto } from 'src/payments/dtos/PaymentBase.dto';
import { WithdrawalMethodCreateDto } from 'src/payments/dtos/WithdrawalMethodCreate.dto';
import { WithdrawalsService } from 'src/payments/services/withdrawals/withdrawals.service';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';

@Controller('withdrawals')
@ApiTags('Withdrawals')
@ApiBearerAuth()
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService: WithdrawalsService,
  ) {}

  @Post('/methods')
  @UseGuards(AdminGuard)
  createWithdrawalMethod(@Body() data: WithdrawalMethodCreateDto){
    return this.withdrawalsService.createWithdrawalMethod(data);
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
