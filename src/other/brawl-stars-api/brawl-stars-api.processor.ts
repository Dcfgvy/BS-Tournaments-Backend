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
  },
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
        const { organizerTag, event, eventMap, bannedBrawlers, winners, teamSize } = job.data;
        return await this.confirmWinners(organizerTag, event, eventMap, bannedBrawlers, winners, teamSize);
    }
  }

  async makeRequest(tag: string, battlelog: boolean = true){
    try {
      const response = await axios.get(
        `https://api.brawlstars.com/v1/players/${encodeURIComponent(tag)}/${battlelog ? 'battlelog': ''}`,
        {
          headers: {
            'Authorization': `Bearer ${appConfig.BRAWL_STARS_API_KEY}`
          }
        }
      );
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
      }
      else if(lastBattle.teams?.length > 0){
        lastBattle.teams.forEach(team => {
          team.forEach(player => {
            allPlayers.push(player);
          })
        });
      }
      else{
        throw new HttpException('No battlelog found', HttpStatus.NOT_FOUND);
      }

      return allPlayers.find((player) => player.tag === tag)?.name || null;
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
    bannedBrawlers: string[],
    winners: string[],
  ): Promise<boolean>;
  confirmWinners(
    organizerTag: string,
    event: string,
    eventMap: string,
    bannedBrawlers: string[],
    winners: string[],
    teamSize: number,
  ): Promise<boolean>;
  async confirmWinners(
    organizerTag: string,
    event: string,
    eventMap: string,
    bannedBrawlers: string[],
    winners: string[],
    teamSize?: number,
  ): Promise<boolean> {
    const battlelog = await this.makeRequest(organizerTag);
    if(battlelog.items.length === 0) throw new Error('No battlelog found');

    const lastBattleData = battlelog.items[0];
    if(battlelog.items[0].event.mode !== event || battlelog.items[0].event.map !== eventMap)
      throw new Error('Last battle was played on the wrong map or event');

    const lastBattle = lastBattleData.battle;
    if(lastBattle.players?.length > 0){

      const allPlayers = lastBattle.players;
      for(let i = 0; i < winners.length; i++){
        if(winners[i] == 'BOT'){
          if(!String(allPlayers[i].name).startsWith('Bot') || allPlayers[i].tag.length > 4){
            return false;
          }
        }
        else if(allPlayers[i].tag != winners[i] || bannedBrawlers.includes(allPlayers[i].brawler.name)) return false;
      }
      return true;
    } else if(lastBattle.teams?.length > 0 && Number(teamSize) > 1){

      for(let i = 0; i < winners.length / teamSize; i++){
        const team: any[] = lastBattle.teams[i];
        const curTeamSize: number = team.length;
        if(curTeamSize !== teamSize) throw new Error('Invalid teams');

        const teamPlayers = winners.slice(curTeamSize * i, i + curTeamSize);
        let foundBotsTags: string[] = [];
        let foundPlayerTags: string[] = []; 
        for(let j = 0; j < teamPlayers.length; j++){

          const playerTag = teamPlayers[j];
          if(playerTag == 'BOT'){
            const bot = team.find((teamPlayer) => {
              if(
                String(teamPlayer.name).startsWith('Bot') &&
                teamPlayer.tag.length <= 4 &&
                foundBotsTags.indexOf(teamPlayer.tag) === -1
              ){
                foundBotsTags.push(teamPlayer.tag);
                return true; // local return
              }
              return false; // local return
            })
            if(!bot){
              // global return
              return false;
            }
          }
          else if(!team.find((teamPlayer) => {
            const result = teamPlayer.tag == playerTag &&
              !bannedBrawlers.includes(teamPlayer.brawler.name) &&
              !foundPlayerTags.includes(teamPlayer.tag);

            if(result) foundPlayerTags.push(teamPlayer.tag);
            return result;
          })) return false;

        }
      }
      return true;
    }
    throw new Error('Battle data invalid');
  }
}
