import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { Tournament } from "../entities/Tournament.entity";
import { TournamentStatus } from "../../tournaments/enums/tournament-status.enum";
import { Injectable, Logger } from "@nestjs/common";
import { TournamentChatGateway } from "../../tournaments/gateways/tournament-chat/tournament-chat.gateway";
import { ModuleRef } from "@nestjs/core";

@Injectable()
@EventSubscriber()
export class TournamentSubscriber implements EntitySubscriberInterface<Tournament> {
  private tournamentChatGateway: TournamentChatGateway;
  private readonly logger = new Logger(TournamentSubscriber.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  listenTo() {
    return Tournament;
  }

  /**
   * Lazy-load the TournamentChatGateway instance using ModuleRef.
   */
  private async getTournamentChatGateway(): Promise<TournamentChatGateway> {
    if(!this.tournamentChatGateway){
      try {
        // Try to get the instance from the module reference.
        this.tournamentChatGateway = await this.moduleRef.resolve(TournamentChatGateway);
      } catch (error) {
        this.logger.error('Unable to resolve TournamentChatGateway', error);
      }
    }
    return this.tournamentChatGateway;
  }

  async beforeUpdate(event: UpdateEvent<Tournament>) {
    if (event.entity && event.entity.status !== event.databaseEntity?.status) {
      const newStatus = event.entity.status as TournamentStatus;
      event.entity.lastStatusUpdate = new Date();

      const gateway = await this.getTournamentChatGateway();
      if(!gateway){
        this.logger.warn('TournamentChatGateway is not available. Skipping disconnection.');
        return;
      }

      this.tournamentChatGateway.updateTournamentStatusById(event.entity.id, newStatus);
      if(
        newStatus === TournamentStatus.CANCELLED
        || newStatus === TournamentStatus.ENDED
      ){
        // Disconnect all clients in the tournament room in a second
        setTimeout(() => {
          this.tournamentChatGateway.disconnectContestantsByTournamentId(event.entity.id);
        }, 1000);
      }
    }
  }
}
