import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { appConfig } from '../../utils/appConfigs';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('brawl-stars-api', {
  concurrency: 1,
  // 1 request per second
  limiter: {
    max: 5,
    duration: 5 * 1000
  }
})
export class BrawlStarsApiService extends WorkerHost {

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'get-name': {
        const { tag } = job.data;
        return await this.getBSName(tag);
      }
      case 'confirm-account-by-tag':
        const { tag, trophyChange } = job.data;
        return await this.confirmAccountByTag(tag, trophyChange);
      case 'confirm-winners':
        const { organizerTag, event, eventMap, winners, teamsNumber, teamSize } = job.data;
        return await this.confirmWinners(organizerTag, event, eventMap, winners, teamsNumber, teamSize);
    }
  }

  async makeRequest(tag: string, battlelog: boolean = true){
    try {
      const response = await axios({
        method: 'get',
        url: `${appConfig.BRAWL_STARS_API_URL}/players/${encodeURIComponent(tag)}/${battlelog ? 'battlelog': ''}`,
        headers: {
          'Authorization': `Bearer ${appConfig.BRAWL_STARS_API_KEY}`
        }
      });
      return response.data;
    } catch (err) {
      throw new HttpException('Intenal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async confirmAccountByTag(tag: string, lastTrophyChange: number): Promise<string> {
    const battlelog = await this.makeRequest(tag);
    if(battlelog.items.length === 0) throw new HttpException('No battlelog found', HttpStatus.NOT_FOUND);

    const lastBattle = battlelog.items[0].battle;
    const trophyChange: number | undefined = lastBattle.trophyChange;
    if(trophyChange === lastTrophyChange || (trophyChange === undefined && lastTrophyChange === 0)){
      // get BS name from the battlelog for optimisation (1 request instead of 2)
      let allPlayers: any[] = [];
      if(lastBattle.players?.length > 0){
        allPlayers = lastBattle.players;
      } else if(lastBattle.teams?.length > 0){
        lastBattle.teams.forEach(team => {
          team.forEach(player => {
            allPlayers.push(player);
          })
        });
      } else{
        throw new HttpException('No battlelog found', HttpStatus.NOT_FOUND);
      }
      return allPlayers.find((player) => player.tag == tag)?.name || null;
    }
    return null;
  }

  async getBSName(tag: string): Promise<string>{
    let userData = await this.makeRequest(tag, false);
    const name: string | undefined = userData.name;
    return name || 'No name';
  }

  confirmWinners(
    organizerTag: string,
    event: string,
    eventMap: string,
    winners: string[]
  );
  confirmWinners(
    organizerTag: string,
    event: string,
    eventMap: string,
    winners: string[],
    teamsNumber: number,
    teamSize: number,
  );
  async confirmWinners(
    organizerTag: string,
    event: string,
    eventMap: string,
    winners: string[],
    teamsNumber?: number,
    teamSize?: number,
  ): Promise<boolean> {
    const battlelog = await this.makeRequest(organizerTag);
    if(battlelog.items.length === 0) throw new Error('No battlelog found');

    const lastBattleData = battlelog.items[0];
    if(battlelog.items[0].event.mode !== event || battlelog.items[0].event.map !== eventMap)
      throw new Error('Last battle was held on the wrong map or event');

    const lastBattle = lastBattleData.battle;
    if(lastBattle.players?.length > 0){

      const allPlayers = lastBattle.players;
      for(let i = 0; i < winners.length; i++){
        if(allPlayers[i].tag != winners[i]) return false;
      }
      return true;
    } else if(lastBattle.teams?.length > 0){

      for(let i = 0; i < teamsNumber; i++){
        const team: any[] = lastBattle.teams[i];
        const curTeamSize: number = team.length;
        if(curTeamSize !== teamSize) throw new Error('Invalid teams');

        const teamPlayers = winners.slice(curTeamSize * i, i + curTeamSize);
        teamPlayers.forEach(player => {
          if(!team.includes(player)) return false;
        });
      }
      return true;
    }
    throw new Error('Battle data invalid');
  }
}
