import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { EventMapsService } from './maps.service';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../users/guards/admin.guard';
import { CreateEventMapDto } from './dtos/CreateMap.dto';
import { UpdateEventMapDto } from './dtos/UpdateMap.dto';
import { EventMapResponseDto } from './dtos/MapResponse.dto';

@Controller('maps')
@ApiTags('Maps')
export class EventMapsController {
  constructor(
    private readonly eventMapsService: EventMapsService
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: EventMapResponseDto })
  getEventMapById(@Param('id', ParseIntPipe) id: number) {
    return this.eventMapsService.fetchEventMapById(id);
  }

  @Get()
  @ApiQuery({ name: 'eventId', required: false, type: Number })
  @ApiOkResponse({ type: [EventMapResponseDto] })
  getAllEventMaps(@Query('eventId', new ParseIntPipe({ optional: true })) eventId?: string) {
    return this.eventMapsService.fetchAllEventMaps(eventId || null);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  createEventMap(@Body() createEventMapDto: CreateEventMapDto){
    return this.eventMapsService.createEventMap(createEventMapDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventMapResponseDto })
  updateEventMap(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventMapDto: UpdateEventMapDto
  ){
    return this.eventMapsService.updateEventMap(id, updateEventMapDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  deleteEventMap(@Param('id', ParseIntPipe) id: number){
    return this.eventMapsService.deleteEventMap(id);
  }
}
