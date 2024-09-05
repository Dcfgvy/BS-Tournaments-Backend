import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from '../../typeorm/entities/Settings.entity';
import { Repository } from 'typeorm';
import { ISettings } from '../../utils/interfaces';
import { appConfig } from '../../utils/appConfigs';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>
  ) {}

  public data: ISettings = null;

  async onModuleInit() {
    const settingsFromDB = await this.settingsRepository.find();
    const hour: number = 1000 * 60 * 60;
    let settings: ISettings = {
      payoutCommission: appConfig.PAYOUT_COMMISSION,
      organizerFee: appConfig.ORGANIZER_FEE,
      tourRecruitmentMaxTime: new Date(new Date().getTime() + hour * appConfig.TOUR_RECRUITMENT_MAX_TIME),
      tourStartAwaitingTime: new Date(new Date().getTime() + hour * appConfig.TOUR_START_AWAITING_TIME),
      tourFreezeTime: new Date(new Date().getTime() + hour * appConfig.TOUR_FREEZE_TIME),
      organizerBanTime: new Date(new Date().getTime() + hour * appConfig.ORGANIZER_BAN_TIME),
      telegramSupport: appConfig.TELEGRAM_SUPPORT,
    };
    // replacing default values from env with data from DB
    for(let i = 0; i < settingsFromDB.length; i++){
      settings[settingsFromDB[i].key] = settingsFromDB[i].value;
    }

    this.data = settings;

    // adding new settings that were not saved in DB
    const settingsKeys: string[] = Object.keys(settings);
    for(let i = 0; i < settingsKeys.length; i++){
      if(settingsFromDB.filter(s => s.key === settingsKeys[i]).length === 0){
        await this.settingsRepository.save({ key: settingsKeys[i], value: settings[settingsKeys[i]] });
      }
    }
  }
}
