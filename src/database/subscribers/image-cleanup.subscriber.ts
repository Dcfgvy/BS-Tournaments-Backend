import { Connection, EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { UploadsService } from '../../uploads/uploads.service';
import { IEntityWithImage } from '../../utils/interfaces';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class ImageCleanupSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectConnection() readonly connection: Connection,
    @Inject(UploadsService) private readonly uploadsService: UploadsService,
  ) {
    connection.subscribers.push(this);
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (event.entity && 'imgUrl' in event.entity) {
      const entityWithImage = event.entity as IEntityWithImage;
      const { imgUrl } = entityWithImage;

      if (imgUrl) {
        await this.uploadsService.deleteFile(imgUrl);
      }
    }
  }
}
