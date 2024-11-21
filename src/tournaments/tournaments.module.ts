import { Module } from '@nestjs/common';
import { TournamentsService } from './services/tournaments/tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from '../typeorm/entities/Tournament.entity';
import { EventMap } from '../typeorm/entities/EventMap.entity';
import { Event } from '../typeorm/entities/Event.entity';
import { Brawler } from '../typeorm/entities/Brawler.entity';
import { BgTournamentsStatusService } from './services/bg-tournaments-status/bg-tournaments-status.service';
import { BullModule } from '@nestjs/bullmq';
import { TournamentChatGateway } from './gateways/tournament-chat/tournament-chat.gateway';
import { WsAuthGuard } from '../users/guards/ws-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from '../utils/appConfigs';

@Module({
  providers: [
    TournamentsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    BgTournamentsStatusService,
    TournamentChatGateway,
    WsAuthGuard,
  ],
  controllers: [TournamentsController],
  imports: [
    TypeOrmModule.forFeature([Tournament, Event, EventMap, Brawler]),
    BullModule.registerQueue({
      name: 'brawl-stars-api'
    }),
    JwtModule.register({
      secret: appConfig.JWT_SECRET,
      signOptions: { expiresIn: '1h' }
    }),
  ],
  exports: [TournamentChatGateway]
})
export class TournamentsModule {}
