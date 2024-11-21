import { Connection, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { Tournament } from "../entities/Tournament.entity";
import { TournamentStatus } from "../../tournaments/enums/tournament-status.enum";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { TournamentChatGateway } from "../../tournaments/gateways/tournament-chat/tournament-chat.gateway";
import { InjectConnection } from "@nestjs/typeorm";

@Injectable()
@EventSubscriber()
export class TournamentSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectConnection() readonly connection: Connection,
    @Inject(TournamentChatGateway) private tournamentChatGateway: TournamentChatGateway) {
      connection.subscribers.push(this);
    }

  listenTo() {
    return Tournament;
  }

  async beforeUpdate(event: UpdateEvent<Tournament>) {
    if (event.entity && event.entity.status !== event.databaseEntity?.status) {
      const newStatus = event.entity.status as TournamentStatus;
      event.entity.lastStatusUpdate = new Date();

      try{
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
      } catch (err){
        console.error(err);
      }
    }
  }
}
