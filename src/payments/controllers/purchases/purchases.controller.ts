import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from 'src/other/pagination/api-pagination.decorator';
import { PaginationParams } from 'src/other/pagination/pagination.decorator';
import { PaginationParamsDto } from 'src/other/pagination/pagination.dto';
import { PurchaseResponseDto } from 'src/payments/dtos/PurchaseResponse.dto';
import { PurchasesService } from 'src/payments/services/purchases/purchases.service';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { CreationDatesDto } from 'src/utils/dtos';

@Controller('purchases')
@ApiTags('Purchases')
@ApiBearerAuth()
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'userId', required: false, type: Number, example: 25 })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, example: '2024-03-04T00:00:00.000Z' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, example: '2024-04-05T00:00:00.000Z' })
  @ApiPagination()
  @ApiOkResponse({ type: Pagination<PurchaseResponseDto> })
  async getAllPurchases(
    @Query() creationDates: CreationDatesDto,
    @Query('userId') userId: number,
    @PaginationParams() paginationParams: PaginationParamsDto,
  ): Promise<Pagination<PurchaseResponseDto>> {
    const { createdFrom, createdTo } = creationDates;
    const purchases = await this.purchasesService.fetchAllPurchases(
      paginationParams,
      userId,
      createdFrom,
      createdTo,
    );
  
    return purchases;
  }
}
