import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramConnectionLink } from 'src/database/entities/TelegramConnectionLink.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class BgExpiredTgLinksDeletionService {
  constructor(
    @InjectRepository(TelegramConnectionLink)
    private TelegramConnectionLinkRepository: Repository<TelegramConnectionLink>
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredTgLinks() {
    await this.TelegramConnectionLinkRepository.delete({
      createdAt: LessThanOrEqual(
        new Date(new Date().getTime() - 1000 * 60 * 30)
      ) // links valid for 30 minutes
    });
  }
}
