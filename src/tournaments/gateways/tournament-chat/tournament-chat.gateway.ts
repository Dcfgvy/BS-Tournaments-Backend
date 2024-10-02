import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TournamentsService } from '../../services/tournaments/tournaments.service';
import { Server, Socket } from 'socket.io';
import { appConfig } from '../../../utils/appConfigs';
import { NodeEnv } from '../../../utils/NodeEnv';
import { Throttle } from '@nestjs/throttler';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../../../users/guards/ws-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { TournamentStatus } from '../../enums/tournament-status.enum';

@Injectable()
@WebSocketGateway({
  namespace: 'tournament-chat',
  cors: {
    origin: appConfig.NODE_ENV === NodeEnv.DEV ? '*' : undefined
  }
})
export class TournamentChatGateway
implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(TournamentChatGateway.name);

  constructor(
    private readonly tounamentsService: TournamentsService,
    private readonly jwtService: JwtService
  ) {}

  afterInit(server: Server){
    this.logger.log(`WebSocket Server Initialized on namespace /tournament-chat`);
  }

  async handleConnection(client: Socket, ...args: any[]){
    // console.log(`Client connected: ${client.id}`);
    try {
      const tournamentId = Number(client.handshake.query.tournamentId);
      const token = client.handshake.query.accessToken as string;

      const user = await this.jwtService.verifyAsync(token);
      if (!user) {
        client.disconnect();
        return;
      }

       // Disconnect if tournament does not exist or user is not a participant
      const tournament = await this.tounamentsService.fetchTournamentById(
        tournamentId,
        [TournamentStatus.WAITING_FOR_START, TournamentStatus.STARTED, TournamentStatus.FROZEN]
      );
      if(!tournament || tournament.contestants.findIndex(c => c.id === Number(user.id)) === -1){
        client.disconnect();
        return;
      }

      // Add the user to a room based on tournament ID
      client.join(`tournament-${tournamentId}`);
      console.log(`User ${user.id} connected to tournament ${tournamentId}`);
    } catch (error) {
      client.disconnect(); // Disconnect if any error occurs
      console.error('Connection error: ', error);
    }
  }

  @UseGuards(WsAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 10 } })
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any){
    // console.log(`User ${client.id} sent message:`, JSON.parse(payload));
    const userId = client.data.user.id as number;
    const tournamentId = Number(client.handshake.query.tournamentId)
    this.server.to(`tournament-${tournamentId}`).emit('message', {
      userId: userId,
      message: JSON.parse(payload).message
    })
  }

  updateTournamentStatusById(id: number, status: TournamentStatus): void {
    this.server.to(`tournament-${id}`).emit('tournament-update', { status });
  }

  disconnectContestantsByTournamentId(id: number): void {
    this.server.in(`tournament-${id}`).disconnectSockets();
    // console.log(`Contestants in tournament ${id} disconnected`);
  }
}
