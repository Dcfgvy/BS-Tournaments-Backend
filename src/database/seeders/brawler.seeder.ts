import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Brawler } from '../entities/Brawler.entity';

interface IBrawler {
  names: {
    en: string;
    ru: string;
  };
  apiName: string;
}

const brawlers: Array<IBrawler> = [
  {
    names: { en: 'Shelly', ru: 'Шелли' },
    apiName: 'SHELLY'
  },
  {
    names: { en: 'Colt', ru: 'Кольт' },
    apiName: 'COLT'
  },
  {
    names: { en: 'Bull', ru: 'Булл' },
    apiName: 'BULL'
  },
  {
    names: { en: 'Brock', ru: 'Брок' },
    apiName: 'BROCK'
  },
  {
    names: { en: 'Rico', ru: 'Рико' },
    apiName: 'RICO'
  },
  {
    names: { en: 'Spike', ru: 'Спайк' },
    apiName: 'SPIKE'
  },
  {
    names: { en: 'Barley', ru: 'Барли' },
    apiName: 'BARLEY'
  },
  {
    names: { en: 'Jessie', ru: 'Джесси' },
    apiName: 'JESSIE'
  },
  {
    names: { en: 'Nita', ru: 'Нита' },
    apiName: 'NITA'
  },
  {
    names: { en: 'Dynamike', ru: 'Динамайк' },
    apiName: 'DYNAMIKE'
  },
  {
    names: { en: 'El Primo', ru: 'Эль Примо' },
    apiName: 'EL PRIMO'
  },
  {
    names: { en: 'Mortis', ru: 'Мортис' },
    apiName: 'MORTIS'
  },
  {
    names: { en: 'Crow', ru: 'Ворон' },
    apiName: 'CROW'
  },
  {
    names: { en: 'Poco', ru: 'Поко' },
    apiName: 'POCO'
  },
  {
    names: { en: 'Bo', ru: 'Бо' },
    apiName: 'BO'
  },
  {
    names: { en: 'Piper', ru: 'Пайпер' },
    apiName: 'PIPER'
  },
  {
    names: { en: 'Pam', ru: 'Пэм' },
    apiName: 'PAM'
  },
  {
    names: { en: 'Tara', ru: 'Тара' },
    apiName: 'TARA'
  },
  {
    names: { en: 'Darryl', ru: 'Дэррил' },
    apiName: 'DARRYL'
  },
  {
    names: { en: 'Penny', ru: 'Пенни' },
    apiName: 'PENNY'
  },
  {
    names: { en: 'Frank', ru: 'Фрэнк' },
    apiName: 'FRANK'
  },
  {
    names: { en: 'Gene', ru: 'Джин' },
    apiName: 'GENE'
  },
  {
    names: { en: 'Tick', ru: 'Тик' },
    apiName: 'TICK'
  },
  {
    names: { en: 'Leon', ru: 'Леон' },
    apiName: 'LEON'
  },
  {
    names: { en: 'Rosa', ru: 'Роза' },
    apiName: 'ROSA'
  },
  {
    names: { en: 'Carl', ru: 'Карл' },
    apiName: 'CARL'
  },
  {
    names: { en: 'Bibi', ru: 'Биби' },
    apiName: 'BIBI'
  },
  {
    names: { en: '8-Bit', ru: '8-Бит' },
    apiName: '8-BIT'
  },
  {
    names: { en: 'Sandy', ru: 'Сэнди' },
    apiName: 'SANDY'
  },
  {
    names: { en: 'Bea', ru: 'Беа' },
    apiName: 'BEA'
  },
  {
    names: { en: 'Emz', ru: 'Эмз' },
    apiName: 'EMZ'
  },
  {
    names: { en: 'Mr. P', ru: 'Мистер П.' },
    apiName: 'MR. P'
  },
  {
    names: { en: 'Max', ru: 'Макс' },
    apiName: 'MAX'
  },
  {
    names: { en: 'Jacky', ru: 'Джеки' },
    apiName: 'JACKY'
  },
  {
    names: { en: 'Gale', ru: 'Гейл' },
    apiName: 'GALE'
  },
  {
    names: { en: 'Nani', ru: 'Нани' },
    apiName: 'NANI'
  },
  {
    names: { en: 'Sprout', ru: 'Спраут' },
    apiName: 'SPROUT'
  },
  {
    names: { en: 'Surge', ru: 'Вольт' },
    apiName: 'SURGE'
  },
  {
    names: { en: 'Colette', ru: 'Колетт' },
    apiName: 'COLETTE'
  },
  {
    names: { en: 'Amber', ru: 'Амбер' },
    apiName: 'AMBER'
  },
  {
    names: { en: 'Lou', ru: 'Лу' },
    apiName: 'LOU'
  },
  {
    names: { en: 'Byron', ru: 'Байрон' },
    apiName: 'BYRON'
  },
  {
    names: { en: 'Edgar', ru: 'Эдгар' },
    apiName: 'EDGAR'
  },
  {
    names: { en: 'Ruffs', ru: 'Гавс' },
    apiName: 'RUFFS'
  },
  {
    names: { en: 'Stu', ru: 'Сту' },
    apiName: 'STU'
  },
  {
    names: { en: 'Belle', ru: 'Белль' },
    apiName: 'BELLE'
  },
  {
    names: { en: 'Squeak', ru: 'Скуик' },
    apiName: 'SQUEAK'
  },
  {
    names: { en: 'Grom', ru: 'Гром' },
    apiName: 'GROM'
  },
  {
    names: { en: 'Buzz', ru: 'Базз' },
    apiName: 'BUZZ'
  },
  {
    names: { en: 'Griff', ru: 'Грифф' },
    apiName: 'GRIFF'
  },
  {
    names: { en: 'Ash', ru: 'Эш' },
    apiName: 'ASH'
  },
  {
    names: { en: 'Meg', ru: 'Мэг' },
    apiName: 'MEG'
  },
  {
    names: { en: 'Lola', ru: 'Лола' },
    apiName: 'LOLA'
  },
  {
    names: { en: 'Fang', ru: 'Фэнг' },
    apiName: 'FANG'
  },
  {
    names: { en: 'Eve', ru: 'Ева' },
    apiName: 'EVE'
  },
  {
    names: { en: 'Janet', ru: 'Джанет' },
    apiName: 'JANET'
  },
  {
    names: { en: 'Bonnie', ru: 'Бонни' },
    apiName: 'BONNIE'
  },
  {
    names: { en: 'Otis', ru: 'Отис' },
    apiName: 'OTIS'
  },
  {
    names: { en: 'Sam', ru: 'Сэм' },
    apiName: 'SAM'
  },
  {
    names: { en: 'Gus', ru: 'Гас' },
    apiName: 'GUS'
  },
  {
    names: { en: 'Buster', ru: 'Бастер' },
    apiName: 'BUSTER'
  },
  {
    names: { en: 'Chester', ru: 'Честер' },
    apiName: 'CHESTER'
  },
  {
    names: { en: 'Gray', ru: 'Грей' },
    apiName: 'GRAY'
  },
  {
    names: { en: 'Mandy', ru: 'Мэнди' },
    apiName: 'MANDY'
  },
  {
    names: { en: 'R-T', ru: 'R-T' },
    apiName: 'R-T'
  },
  {
    names: { en: 'Willow', ru: 'Виллоу' },
    apiName: 'WILLOW'
  },
  {
    names: { en: 'Maisie', ru: 'Мэйси' },
    apiName: 'MAISIE'
  },
  {
    names: { en: 'Hank', ru: 'Хэнк' },
    apiName: 'HANK'
  },
  {
    names: { en: 'Cordelius', ru: 'Корделиус' },
    apiName: 'CORDELIUS'
  },
  {
    names: { en: 'Doug', ru: 'Даг' },
    apiName: 'DOUG'
  },
  {
    names: { en: 'Pearl', ru: 'Перл' },
    apiName: 'PEARL'
  },
  {
    names: { en: 'Chuck', ru: 'Чак' },
    apiName: 'CHUCK'
  },
  {
    names: { en: 'Charlie', ru: 'Чарли' },
    apiName: 'CHARLIE'
  },
  {
    names: { en: 'Mico', ru: 'Мико' },
    apiName: 'MICO'
  },
  {
    names: { en: 'Kit', ru: 'Кит' },
    apiName: 'KIT'
  },
  {
    names: { en: 'Larry & Lawrie', ru: 'Ларри и Лори' },
    apiName: 'LARRY & LAWRIE'
  },
  {
    names: { en: 'Melodie', ru: 'Мелоди' },
    apiName: 'MELODIE'
  },
  {
    names: { en: 'Angelo', ru: 'Анджело' },
    apiName: 'ANGELO'
  },
  {
    names: { en: 'Draco', ru: 'Драко' },
    apiName: 'DRACO'
  },
  {
    names: { en: 'Lily', ru: 'Лили' },
    apiName: 'LILY'
  },
  {
    names: { en: 'Berry', ru: 'Берри' },
    apiName: 'BERRY'
  },
  {
    names: { en: 'Clancy', ru: 'Клэнси' },
    apiName: 'CLANCY'
  },
  {
    names: { en: 'Moe', ru: 'Мо' },
    apiName: 'MOE'
  },
  {
    names: { en: 'Kenji', ru: 'Кэндзи' },
    apiName: 'KENJI'
  },
  {
    names: { en: 'Shade', ru: 'Шейд' },
    apiName: 'SHADE'
  },
  {
    names: { en: 'Juju', ru: 'Джуджу' },
    apiName: 'JUJU'
  }
];

export default class BrawlerSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    const repository = dataSource.getRepository(Brawler);

    console.log('Creating brawlers...');
    for(const brawler of brawlers){
      await repository.upsert({
        ...brawler,
        names: brawler.names,
        imgUrl: 'api/uploads/images/' + brawler.apiName.toLowerCase().replace(' ', '_') + '.png',
      }, ['apiName']);
    }
  }
}
