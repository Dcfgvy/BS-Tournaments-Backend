import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../database/entities/Settings.entity';
import { ChannelToPost } from 'src/database/entities/ChannelToPost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings, ChannelToPost])],
  providers: [SettingsService],
  controllers: [SettingsController]
})
export class SettingsModule {}
