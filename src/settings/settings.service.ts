import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from '../database/entities/Settings.entity';
import { Repository } from 'typeorm';
import { ISettings } from '../utils/interfaces';
import { appConfig } from '../utils/appConfigs';
import { convertValue } from '../utils/other';
import { AddChannelToPostDto } from './dtos/AddChannel.dto';
import { ChannelToPost } from 'src/database/entities/ChannelToPost.entity';
import { EditChannelToPostDto } from './dtos/EditChannel.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
    @InjectRepository(ChannelToPost)
    private channelToPostRepository: Repository<ChannelToPost>,
  ) {}

  public static data: ISettings = null;

  async onModuleInit() {
    if(SettingsService.data) return;
    this.updateSettings();
  }

  async updateSettings(): Promise<void> {
    const settingsFromDB = await this.settingsRepository.find();
    const hour: number = 1000 * 60 * 60;
    let settings: ISettings = {
      organizerFee: appConfig.ORGANIZER_FEE,
      tourRecruitmentMaxTime: hour * appConfig.TOUR_RECRUITMENT_MAX_TIME,
      tourStartAwaitingTime: hour * appConfig.TOUR_START_AWAITING_TIME,
      tourPlayingMaxTime: hour * appConfig.TOUR_PLAYING_MAX_TIME,
      tourFreezeTime: hour * appConfig.TOUR_FREEZE_TIME,
      organizerBanTime:  hour * appConfig.ORGANIZER_BAN_TIME,
      tourCreationFee: appConfig.TOUR_CREATION_FEE,
      globalMessage: "",
    };
    // replacing default values from env with data from DB
    for(let i = 0; i < settingsFromDB.length; i++){
      settings[settingsFromDB[i].key] = convertValue(settingsFromDB[i].value, settingsFromDB[i].type);
    }

    SettingsService.data = settings;

    // adding new settings that were not saved in DB
    const settingsKeys: string[] = Object.keys(settings);
    for(let i = 0; i < settingsKeys.length; i++){
      const currentKey = settingsKeys[i];
      if(settingsFromDB.filter(s => s.key === currentKey).length === 0){

        let type: string = typeof settings[currentKey];
        if(type === 'object' && new Date(settings[currentKey]).getTime()) type = 'number';
        await this.settingsRepository.save({
          key: currentKey, 
          value: settings[currentKey],
          type,
        });

      }
    }
  }

  getAdminSettings(): Promise<Settings[]> {
    return this.settingsRepository.find();
  }

  async updateAdminSetting(key: string, value: any): Promise<void> {
    let setting = await this.settingsRepository.findOneBy({ key });
    if(!setting) throw new HttpException("Setting not found", HttpStatus.BAD_REQUEST);

    if(typeof value !== setting.type) throw new HttpException("Invalid setting type", HttpStatus.BAD_REQUEST);

    setting.value = String(value);
    await this.settingsRepository.save(setting);
    await this.updateSettings();
  }

  async getChannelsToPost(): Promise<ChannelToPost[]> {
    return this.channelToPostRepository.find();
  }

  async addChannelToPost(data: AddChannelToPostDto): Promise<void> {
    const channel = this.channelToPostRepository.create(data);
    await this.channelToPostRepository.save(channel);
    return;
  }

  async editChannelToPost(channel: string, data: EditChannelToPostDto): Promise<void> {
    await this.channelToPostRepository.update({
      username: channel,
    }, {
      language: data.language,
    });
    return;
  }

  async deleteChannelToPost(channel: string): Promise<void> {
    await this.channelToPostRepository.delete({
      username: channel,
    });
    return;
  }
}
