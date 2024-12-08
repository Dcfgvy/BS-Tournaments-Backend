import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventMap } from '../entities/EventMap.entity';


const gemBrabMaps = [
  {
    names: { en: 'Hard Rock Mine', ru: 'Роковая шахта' },
    apiName: 'Hard Rock Mine',
  },
  {
    names: { en: 'Gem Fort', ru: 'Кристальный форт' },
    apiName: 'Gem Fort',
  },
  {
    names: { en: 'Undermine', ru: 'Подрыв' },
    apiName: 'Undermine',
  },
  {
    names: { en: 'Double Swoosh', ru: 'Вжух-вжух' },
    apiName: 'Double Swoosh',
  },
  {
    names: { en: 'Minecart Madness', ru: 'Вагонетка без тормозов' },
    apiName: 'Minecart Madness',
  },
  {
    names: { en: 'Acute Angle', ru: 'Острый угол' },
    apiName: 'Acute Angle',
  },
  {
    names: { en: 'Rustic Arcade', ru: 'Сельский клуб' },
    apiName: 'Rustic Arcade',
  },
  {
    names: { en: 'Open Space', ru: 'Открытая местность' },
    apiName: 'Open Space',
  },
  {
    names: { en: 'Last Stop', ru: 'Конечная станция' },
    apiName: 'Last Stop',
  },
  {
    names: { en: 'Sneaky Sneak', ru: 'На цыпочках' },
    apiName: 'Sneaky Sneak',
  },
  {
    names: { en: 'Pineapple Plaza', ru: 'Ананасовая площадь' },
    apiName: 'Pineapple Plaza',
  },
  {
    names: { en: 'Corkscrew', ru: 'Штопор' },
    apiName: 'Corkscrew',
  },
];

const showdownMaps = [
  {
    names: { en: 'Skull Creek', ru: 'Озеро мертвецов' },
    apiName: 'Skull Creek',
  },
  {
    names: { en: 'Rockwall Brawl', ru: 'Потасовка в Рокуолле' },
    apiName: 'Rockwall Brawl',
  },
  {
    names: { en: 'Feast or Famine', ru: 'Всё или ничего' },
    apiName: 'Feast or Famine',
  },
  {
    names: { en: 'Cavern Churn', ru: 'Штольня' },
    apiName: 'Cavern Churn',
  },
  {
    names: { en: 'Double Trouble', ru: 'Двойная проблема' },
    apiName: 'Double Trouble',
  },
  {
    names: { en: 'Stormy Plains', ru: 'Ветреная долина' },
    apiName: 'Stormy Plains',
  },
  {
    names: { en: 'Dark Passage', ru: 'Проход' },
    apiName: 'Dark Passage',
  },
  {
    names: { en: 'Flying Fantasies', ru: 'Полёт фантазии' },
    apiName: 'Flying Fantasies',
  },
  {
    names: { en: 'Safety Center', ru: 'Убежище' },
    apiName: 'Safety Center',
  },
  {
    names: { en: 'Sunset Vista', ru: 'Красочный закат' },
    apiName: 'Sunset Vista',
  },
];

const heistMaps = [
  {
    names: { en: 'Kaboom Canyon', ru: 'Похоровый каньон' },
    apiName: 'Kaboom Canyon',
  },
  {
    names: { en: 'Safe Zone', ru: 'Надёжное укрытие' },
    apiName: 'Safe Zone',
  },
  {
    names: { en: 'Hot Potato', ru: 'Горячая кукуруза' },
    apiName: 'Hot Potato',
  },
  {
    names: { en: 'Bridge Too Far', ru: 'Взятие моста' },
    apiName: 'Bridge Too Far',
  },
  {
    names: { en: 'Secret or Mystery', ru: 'Загадочный секрет' },
    apiName: 'Secret or Mystery',
  },
  {
    names: { en: 'Electric Storm', ru: 'Электрическая буря' },
    apiName: 'Electric Storm',
  },
];

const bountyMaps = [
  {
    names: { en: 'Snake Prairie', ru: 'Змеиные степи' },
    apiName: 'Snake Prairie',
  },
  {
    names: { en: 'Shooting Star', ru: 'Падающая звезда' },
    apiName: 'Shooting Star',
  },
  {
    names: { en: 'Canal Grande', ru: 'Гранд-канал' },
    apiName: 'Canal Grande',
  },
  {
    names: { en: 'Excel', ru: 'Царь горы' },
    apiName: 'Excel',
  },
  {
    names: { en: 'Layer Cake', ru: 'Кремовый торт' },
    apiName: 'Layer Cake',
  },
  {
    names: { en: 'Dry Season', ru: 'Засуха' },
    apiName: 'Dry Season',
  },
];

const brawlBallMaps = [
  {
    names: { en: 'Backyard Bowl', ru: 'Дворовый чемпионат' },
    apiName: 'Backyard Bowl',
  },
  {
    names: { en: 'Triple Dribble', ru: 'Трипл-дриблинг' },
    apiName: 'Triple Dribble',
  },
  {
    names: { en: 'Sneaky Fields', ru: 'Зловредные поля' },
    apiName: 'Sneaky Fields',
  },
  {
    names: { en: 'Super Beach', ru: 'Суперпляж' },
    apiName: 'Super Beach',
  },
  {
    names: { en: 'Pinball Dreams', ru: 'Пинбол' },
    apiName: 'Pinball Dreams',
  },
  {
    names: { en: 'Center Stage', ru: 'В центре внимания' },
    apiName: 'Center Stage',
  },
  {
    names: { en: 'Beach Ball', ru: 'Пляжный волейбол' },
    apiName: 'Beach Ball',
  },
  {
    names: { en: 'Sunny Soccer', ru: 'Солнечный футбол' },
    apiName: 'Sunny Soccer',
  },
  {
    names: { en: 'Penalty Kick', ru: 'Пенальти' },
    apiName: 'Penalty Kick',
  },
  {
    names: { en: 'Back Pocket', ru: 'Задний карман' },
    apiName: 'Back Pocket',
  },
  {
    names: { en: 'Weak Foot', ru: 'Слабая сторона' },
    apiName: 'Weak Foot',
  },
  {
    names: { en: 'Razzle Dazzle', ru: 'Кутерьма' },
    apiName: 'Razzle Dazzle',
  },
];

const hotZoneMaps = [
  {
    names: { en: 'Open Business', ru: 'Открыто!' },
    apiName: 'Open Business',
  },
  {
    names: { en: 'Parallel Plays', ru: 'Параллельная игра' },
    apiName: 'Parallel Plays',
  },
  {
    names: { en: 'Ring of Fire', ru: 'Огненное кольцо' },
    apiName: 'Ring of Fire',
  },
  {
    names: { en: 'Dueling Beetles', ru: 'Муравьиные бега' },
    apiName: 'Dueling Beetles',
  },
  {
    names: { en: 'Rush', ru: 'Гонка' },
    apiName: 'Rush',
  },
  {
    names: { en: 'From Dusk till Dawn', ru: 'От заката до рассвета' },
    apiName: 'From Dusk till Dawn',
  },
];

const knockoutMaps = [
  {
    names: { en: 'Goldarm Gulch', ru: 'Ущелье Золотой руки' },
    apiName: 'Goldarm Gulch',
  },
  {
    names: { en: "Belle's Rock", ru: 'Живописный утёс' },
    apiName: "Belle's Rock",
  },
  {
    names: { en: 'Flaring Phoenix', ru: 'Пылающий феникс' },
    apiName: 'Flaring Phoenix',
  },
  {
    names: { en: 'Out in the Open', ru: 'В чистом поле' },
    apiName: 'Out in the Open',
  },
  {
    names: { en: 'New Horizons', ru: 'Новые горизонты' },
    apiName: 'New Horizons',
  },
  {
    names: { en: 'Between the Rivers', ru: 'Междуречье' },
    apiName: 'Between the Rivers',
  },
  {
    names: { en: 'Four Levels', ru: 'Четыре уровня' },
    apiName: 'Four Levels',
  },
  {
    names: { en: 'Twilight Passage', ru: 'Сумеречная тропа' },
    apiName: 'Twilight Passage',
  },
  {
    names: { en: 'Hard Lane', ru: 'Опасный переулок' },
    apiName: 'Hard Lane',
  },
  {
    names: { en: 'Island Hopping', ru: 'Круиз по островам' },
    apiName: 'Island Hopping',
  },
  {
    names: { en: 'Sunset Spar', ru: 'Битва на закате' },
    apiName: 'Sunset Spar',
  },
  {
    names: { en: 'Gratitude', ru: 'Благодарность' },
    apiName: 'Gratitude',
  },
];


// {
//   names: { en: 'NAME_EN', ru: 'NAME_RU' },
//   apiName: 'API_NAME',
// },

const items = [
  {
    names: { en: 'Gem Grab', ru: 'Захват Кристаллов' },
    imgUrl: 'uploads/images/gem-grab.png',
    apiName: 'gemGrab',
    isSolo: false,
    teamSize: 3,
    playersNumberOptions: [6],
    maps: gemBrabMaps
  },
  {
    names: { en: 'Solo Showdown', ru: 'Одиночное Столкновение' },
    imgUrl: 'uploads/images/showdown.png',
    apiName: 'soloShowdown',
    isSolo: true,
    teamSize: null,
    playersNumberOptions: [5, 6, 7, 8, 9, 10],
    maps: showdownMaps
  },
  {
    names: { en: 'Duo Showdown', ru: 'Парное Столкновение' },
    imgUrl: 'uploads/images/showdown.png',
    apiName: 'duoShowdown',
    isSolo: false,
    teamSize: 2,
    playersNumberOptions: [6, 8, 10],
    maps: showdownMaps
  },
  {
    names: { en: 'Heist', ru: 'Ограбление' },
    imgUrl: 'uploads/images/heist.png',
    apiName: 'heist',
    isSolo: false,
    teamSize: 3,
    playersNumberOptions: [6],
    maps: heistMaps
  },
  {
    names: { en: 'Bounty', ru: 'Награда за Поимку' },
    imgUrl: 'uploads/images/bounty.png',
    apiName: 'bounty',
    isSolo: false,
    teamSize: 3,
    playersNumberOptions: [6],
    maps: bountyMaps
  },
  {
    names: { en: 'Brawl Ball', ru: 'Броулбол' },
    imgUrl: 'uploads/images/brawl-ball.png',
    apiName: 'brawlBall',
    isSolo: false,
    teamSize: 3,
    playersNumberOptions: [6],
    maps: brawlBallMaps,
  },
  {
    names: { en: 'Hot Zone', ru: 'Горячая Зона' },
    imgUrl: 'uploads/images/hot-zone.png',
    apiName: 'hotZone',
    isSolo: false,
    teamSize: 3,
    playersNumberOptions: [6],
    maps: hotZoneMaps
  },
  {
    names: { en: 'Knockout', ru: 'Нокаут' },
    imgUrl: 'uploads/images/knockout.png',
    apiName: 'knockout',
    isSolo: false,
    teamSize: 3,
    playersNumberOptions: [6],
    maps: knockoutMaps
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
      await eventRepository.upsert(event, ['apiName']);
      for(const map of item.maps){
        const mapEntity = mapRepository.create({
          ...map,
          names: JSON.stringify(map.names),
          imgUrl: 'uploads/images/' + map.apiName.toLowerCase().replace(' ', '_') + '.png',
          postImgUrl: null,
          event: event,
          eventId: event.id,
        });
        await mapRepository.upsert(mapEntity, ['apiName']);
      }
    }
  }
}
