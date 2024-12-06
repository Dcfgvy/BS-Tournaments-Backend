import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventMap } from '../entities/EventMap.entity';

const items = [
  {
    names: { en: 'Solo Showdown', ru: 'Одиночное столкновение' },
    imgUrl: 'uploads/images/solo-showdown.png',
    apiName: 'soloShowdown',
    isSolo: true,
    teamSize: null,
    playersNumberOptions: [5, 6, 7, 8, 9, 10],
    maps: [
      {
        names: { en: 'Cavern Churn', ru: 'Штольня' },
        apiName: 'Cavern Churn',
      }
    ]
  },
]
/*
{
    names: { en: 'NAME_EN', ru: 'NAME_RU' },
    imgUrl: 'IMG_URL',
    apiName: 'API_NAME',
    isSolo: true,
    teamSize: null,
    playersNumberOptions: [5, 6, 7, 8, 9, 10],
    maps: [
      {
        names: { en: 'NAME_EN', ru: 'NAME_RU' },
        imgUrl: 'IMG_URL',
        postImgUrl: 'POST_IMG_URL',
        apiName: 'API_NAME',
      }
    ]
  },
*/

export default class EventAndMapSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    const eventRepository = dataSource.getRepository(Event);
    const mapRepository = dataSource.getRepository(EventMap);

    console.log('Creating events and maps...');
    for(const item of items){
      const event = eventRepository.create({
        ...item,
        names: JSON.stringify(item.names),
      });
      await eventRepository.save(event);
      for(const map of item.maps){
        const mapEntity = mapRepository.create({
          ...map,
          names: JSON.stringify(map.names),
          imgUrl: 'uploads/images/' + map.apiName.toLowerCase().replace(' ', '_') + '.png',
          postImgUrl: 'uploads/images/' + map.apiName.toLowerCase().replace(' ', '_') + '_post.png',
          event: event,
          eventId: event.id,
        });
        await mapRepository.save(mapEntity);
      }
    }
  }
}
