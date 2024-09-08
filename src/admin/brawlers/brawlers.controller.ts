import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BrawlersService } from './brawlers.service';
import { AdminGuard } from '../../users/guards/admin.guard';
import { CreateBrawlerDto } from './dtos/CreateBrawler.dto';
import { UpdateBrawlerDto } from './dtos/UpdateBrawler.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('brawlers')
@ApiTags('Brawlers')
export class BrawlersController {
  constructor(
    private readonly brawlersService: BrawlersService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  getAllBrawlers() {
    return this.brawlersService.fetchAllBrawlers();
  }

  @Get('active')
  getActiveBrawlers() {
    return this.brawlersService.fetchActiveBrawlers();
  }

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  createBrawler(@Body() createBrawlerDto: CreateBrawlerDto){
    return this.brawlersService.createBrawler(createBrawlerDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
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
