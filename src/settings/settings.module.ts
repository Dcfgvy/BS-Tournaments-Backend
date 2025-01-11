import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../database/entities/Settings.entity';
import { ChannelToPost } from 'src/database/entities/ChannelToPost.entity';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Settings, ChannelToPost]),
    TelegramBotModule,
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService]
})
export class SettingsModule {}
