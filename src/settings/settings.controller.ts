import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AdminGuard } from '../users/guards/admin.guard';
import { ChangeAdminSettingDto } from './dtos/ChangeAdminSetting.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
}
