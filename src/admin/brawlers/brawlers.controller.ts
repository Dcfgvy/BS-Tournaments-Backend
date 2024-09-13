import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { BrawlersService } from './brawlers.service';
import { AdminGuard } from '../../users/guards/admin.guard';
import { CreateBrawlerDto } from './dtos/CreateBrawler.dto';
import { UpdateBrawlerDto } from './dtos/UpdateBrawler.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BrawlerResponseDto } from './dtos/BrawlerResponse.dto';
import { Roles } from '../../users/decorators/roles.decorator';

@Controller('brawlers')
@ApiTags('Brawlers')
export class BrawlersController {
  constructor(
    private readonly brawlersService: BrawlersService,
  ) {}

  @Get('active')
  @ApiOkResponse({ type: [BrawlerResponseDto] })
  getActiveBrawlers() {
    return this.brawlersService.fetchActiveBrawlers();
  }

  @Get(':id')
  @ApiOkResponse({ type: BrawlerResponseDto })
  getBrawlerById(@Roles() roles: number[], @Param('id', ParseIntPipe) id: number) {
    return this.brawlersService.fetchBrawlerById(id, roles);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [BrawlerResponseDto] })
  getAllBrawlers() {
    return this.brawlersService.fetchAllBrawlers();
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  createBrawler(@Body() createBrawlerDto: CreateBrawlerDto){
    return this.brawlersService.createBrawler(createBrawlerDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BrawlerResponseDto })
  updateBrawler(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrawlerDto: UpdateBrawlerDto
  ){
    return this.brawlersService.updateBrawler(id, updateBrawlerDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  deleteBrawler(@Param('id', ParseIntPipe) id: number){
    return this.brawlersService.deleteBrawler(id);
  }
}
