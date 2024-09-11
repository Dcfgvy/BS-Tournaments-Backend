import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { Tournament } from "../entities/Tournament.entity";

@EventSubscriber()
export class TournamentSubscriber implements EntitySubscriberInterface<Tournament> {
  listenTo() {
    return Tournament;
  }

  async beforeUpdate(event: UpdateEvent<Tournament>) {
    if (event.entity && event.entity.status !== event.databaseEntity?.status) {
      event.entity.lastStatusUpdate = new Date();
    }
  }
}
