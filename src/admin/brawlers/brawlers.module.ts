import { Module } from '@nestjs/common';
import { BrawlersController } from './brawlers.controller';
import { BrawlersService } from './brawlers.service';

@Module({
  controllers: [BrawlersController],
  providers: [BrawlersService]
})
export class BrawlersModule {}
