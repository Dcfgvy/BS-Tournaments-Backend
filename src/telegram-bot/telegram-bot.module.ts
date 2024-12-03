import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { TelegramConnectionLink } from 'src/database/entities/TelegramConnectionLink.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TelegramConnectionLink])],
  providers: [TelegramBotService],
  exports: [TelegramBotService]
})
export class TelegramBotModule {}
