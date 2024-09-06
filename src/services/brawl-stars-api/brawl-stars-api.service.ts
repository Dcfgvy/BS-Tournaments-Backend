import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import { getRandomInt } from '../../utils/other';
import { appConfig } from '../../utils/appConfigs';

@Injectable()
export class BrawlStarsApiService {
  constructor(){}

  private requestQueue: { tag: string; battlelog: boolean; resolve: (data: any) => void; reject: (error: any) => void; }[] = [];
  private isProcessing = false;

  async fetchData(tag: string, battlelog: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.requestQueue.length > 1000) reject('Too many requests in queue');
      else{
        this.requestQueue.push({ tag, battlelog, resolve, reject });
        this.processQueue();
      }
    });
  }

  private async processQueue(){
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0){
      const { tag, battlelog, resolve, reject } = this.requestQueue.shift()!;

      try {
        const response = await axios({
          method: 'get',
          url: `${appConfig.BRAWL_STARS_API_URL}/players/${encodeURIComponent(tag)}/${battlelog ? 'battlelog': ''}`,
          headers: {
            'Authorization': `Bearer ${appConfig.BRAWL_STARS_API_KEY}`
          }
        });
        resolve(response.data);
      } catch (err) {
        reject(err);
      }

      await this.delay(1000 + getRandomInt(0, 100));
    }

    this.isProcessing = false;
  }

  private delay(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async confirmAccountByTag(tag: string, lastTrophyChange: number){
    let battlelog: any;
    try{
      battlelog = await this.fetchData(tag);
    } catch (err) {
      throw new HttpException('User with this tag not found', HttpStatus.NOT_FOUND);
    }
    if(battlelog.items.length === 0) throw new HttpException('No battlelog found', HttpStatus.NOT_FOUND);

    const trophyChange: number | undefined = battlelog.items[0].battle.trophyChange;
    if(trophyChange === lastTrophyChange || (trophyChange === undefined && lastTrophyChange === 0)){
      return true;
    }
    return false;
  }

  async getBSName(tag: string){
    let userData: any;
    try{
      userData = await this.fetchData(tag, false);
    } catch (err) {
      throw new HttpException('User with this tag not found', HttpStatus.NOT_FOUND);
    }

    const name: string | undefined = userData.name;
    return name || 'No name';
  }
}
