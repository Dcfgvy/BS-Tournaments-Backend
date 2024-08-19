import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { HttpStatusCode } from 'axios';
import { User } from 'src/typeorm/entities/User.entity';
import { appConfig } from 'src/utils/appConfigs';
import { getRandomInt } from 'src/utils/other';
import { Repository } from 'typeorm';

@Injectable()
export class BrawlStarsApiService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ){}

  private requestQueue: { tag: string; resolve: (data: any) => void; reject: (error: any) => void; }[] = [];
  private isProcessing = false;

  async fetchBattlelog(tag: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.requestQueue.length > 1000) reject('Too many requests in queue');
      else{
        this.requestQueue.push({ tag, resolve, reject });
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { tag, resolve, reject } = this.requestQueue.shift()!;

      try {
        const response = await axios({
          method: 'get',
          url: `${appConfig.BRAWL_STARS_API_URL}/players/${encodeURIComponent(tag)}/battlelog`,
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

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async confirmAccountByTag(user: User, tag: string, lastTrophyChange: number) {
    if(user.isAccountConfirmed) throw new HttpException('Account is already confirmed', HttpStatusCode.Conflict);

    const battlelog = await this.fetchBattlelog(tag);
    if(battlelog.items.length === 0) throw new HttpException('No battlelog found', HttpStatus.NOT_FOUND);
    
    const trophyChange: number | undefined = battlelog.items[0].battle.trophyChange;
    if(trophyChange === lastTrophyChange || (trophyChange === undefined && lastTrophyChange === 0)){
      await this.userRepository.update({
        id: user.id
      }, {
        brawlStarsTag: tag.toUpperCase(),
        isAccountConfirmed: true
      })
      return true;
    } else {
      throw new HttpException('Invalid trophy change', HttpStatus.BAD_REQUEST);
    }
  }
}
