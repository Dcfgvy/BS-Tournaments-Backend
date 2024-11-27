import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/User.entity';
import { WithdrawalsService } from 'src/payments/services/withdrawals/withdrawals.service';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';

@Controller('withdrawals')
@ApiTags('Withdrawals')
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService: WithdrawalsService,
  ) {}

  @Post('/withdraw')
  @UseGuards(AuthGuard)
  withdraw(
    @Query('method') methodName: string,
    @GetUser() user: User,
    @Body() data: any,
  ){
    return this.withdrawalsService.makeWithdrawal(methodName, user, data);
  }
}
