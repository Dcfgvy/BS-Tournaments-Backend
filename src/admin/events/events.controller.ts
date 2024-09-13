import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../users/guards/admin.guard';
import { CreateEventDto } from './dtos/CreateEvent.dto';
import { UpdateEventDto } from './dtos/UpdateEvent.dto';
import { EventResponseDto } from './dtos/EventResponse.dto';
import { Roles } from '../../users/decorators/roles.decorator';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService
  ) {}

  @Get('active')
  @ApiOkResponse({ type: [EventResponseDto] })
  getActiveEvents() {
    return this.eventsService.fetchActiveEvents();
  }

  @Get(':id')
  @ApiOkResponse({ type: EventResponseDto })
  getEventById(@Roles() roles: number[], @Param('id', ParseIntPipe) id: number) {
    return this.eventsService.fetchEventById(id, roles);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [EventResponseDto] })
  getAllEvents() {
    return this.eventsService.fetchAllEvents();
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  createEvent(@Body() createEventDto: CreateEventDto){
    return this.eventsService.createEvent(createEventDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventResponseDto })
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto
  ){
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  deleteEvent(@Param('id', ParseIntPipe) id: number){
    return this.eventsService.deleteEvent(id);
  }
}
