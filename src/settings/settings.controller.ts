import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AdminGuard } from '../users/guards/admin.guard';
import { ChangeAdminSettingDto } from './dtos/ChangeAdminSetting.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddChannelToPostDto } from './dtos/AddChannel.dto';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService
  ) {}

  @Get('/public')
  getPublicSettings() {
    return SettingsService.data;
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  getAdminSettings() {
    return this.settingsService.getAdminSettings();
  }

  @Put()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  changeAdminSetting(@Body() data: ChangeAdminSettingDto) {
    return this.settingsService.updateAdminSetting(data.key, data.value);
  }

  @Post('/channels')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  addChannelToPost(@Body() data: AddChannelToPostDto) {
    return this.settingsService.addChannelToPost(data);
  }

  @Put('/channels/:channelName')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  editChannelToPost(@Body() data: AddChannelToPostDto, @Param('channelName') channelName: string) {
    return this.settingsService.editChannelToPost(channelName, data);
  }

  @Delete('/channels/:channelName')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  deleteChannelToPost(@Param('channelName') channelName: string) {
    return this.settingsService.deleteChannelToPost(channelName);
  }
}
