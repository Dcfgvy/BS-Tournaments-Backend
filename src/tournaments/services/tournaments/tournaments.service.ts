import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
import { Tournament } from '../../../typeorm/entities/Tournament.entity';
import { TournamentStatus } from '../../enums/tournament-status.enum';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../../../typeorm/entities/User.entity';
import { Event } from '../../../typeorm/entities/Event.entity';
import { EventMap } from '../../../typeorm/entities/EventMap.entity';
import { Brawler } from '../../../typeorm/entities/Brawler.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentsRepository: Repository<Tournament>,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventMap)
    private readonly eventMapsRepository: Repository<EventMap>,
    @InjectRepository(Brawler)
    private readonly brawlersRepository: Repository<Brawler>,
    private dbConnection: Connection
  ) {}

  async fetchActiveTournaments(
    paginationOptions: IPaginationOptions,
    costFrom: number,
    costTo: number,
    playersNumberFrom: number,
    playersNumberTo: number,
    eventId: number,
    bannedBrawlers: number[],
  ) {
    let query = this.tournamentsRepository
      .createQueryBuilder('tournaments')
      .leftJoinAndSelect('tournaments.bannedBrawlers', 'brawlers')
      .leftJoinAndSelect('tournaments.contestants', 'contestants')
      .where('tournaments.status = :status', { status: TournamentStatus.RECRUITMENT })
      .andWhere('tournaments.entryCost BETWEEN :minCost AND :maxCost', { minCost: costFrom || 0, maxCost: costTo || 1000000 })
      .andWhere('tournaments.playersNumber BETWEEN :minPlayers AND :maxPlayers', { minPlayers: playersNumberFrom || 1, maxPlayers: playersNumberTo || 100 });
  
    if (eventId) {
      query = query.andWhere('tournaments.eventId = :eventId', { eventId });
    }
  
    if (bannedBrawlers && bannedBrawlers.length > 0) {
      query = query.andWhere('brawlers.id IN (:...brawlerIds)', { brawlerIds: bannedBrawlers });
    }

    query = query
      .groupBy('tournaments.id, brawlers.id, contestants.id')
      .orderBy('tournaments.playersNumber - COUNT(contestants.id)', 'ASC')
      .addOrderBy('EXTRACT(EPOCH FROM (NOW() - tournaments.lastStatusUpdate))', 'DESC');
  
    return paginate<Tournament>(query, paginationOptions);
  }

  async checkUserParticipation(user: User){
    const tournaments = await this.tournamentsRepository.findBy({
      contestants: { id: user.id },
      status: In([TournamentStatus.RECRUITMENT, TournamentStatus.WAITING_FOR_START, TournamentStatus.STARTED])
    });
    return tournaments.length > 0;
  }

  async createTournament(
    organizer: User,
    eventId: number,
    eventMapId: number,
    bannedBrawlesIds: number[],
    entryCost: number,
    playersNumber: number,
    prizes: number[],
  ) {
    // check if event exists
    const event = await this.eventsRepository.findOneBy({ id: eventId });
    if(!event) throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);

    // playersNumber exists as a players number option for the event
    if(!event.playersNumberOptions.includes(playersNumber))
      throw new HttpException('Players number is not available for this event', HttpStatus.BAD_REQUEST);

    // eventMap for the event should exist
    const eventMap = await this.eventMapsRepository.findOneBy({
      id: eventMapId,
      event: event
    });
    if(!eventMap) throw new HttpException('Event map not found', HttpStatus.BAD_REQUEST);

    // all bannedBrawlers should exist
    const bannedBrawlers = await this.brawlersRepository.findBy({ id: In(bannedBrawlesIds) });
    if(bannedBrawlers.length !== bannedBrawlesIds.length)
      throw new HttpException('Some brawlers not found', HttpStatus.BAD_REQUEST);

    // sort prizes in descending order
    prizes.sort((a, b) => b - a);

    // check if sum of all prized does not exceed
    //       entryCost * (playersNumber - 1 (one player is the organizer, so he/she doesn't count))
    if(prizes.reduce((prev, curr) => prev + curr) > entryCost * (playersNumber - 1))
      throw new HttpException("Sum of all prizes cannot be more than all entries' costs", HttpStatus.BAD_REQUEST);

    // check if user already participates in another tournament
    if(await this.checkUserParticipation(organizer))
      throw new HttpException('User already participates in another tournament', HttpStatus.CONFLICT);

    // finally create a new tournament
    return this.tournamentsRepository.create({
      entryCost,
      playersNumber,
      prizes,
      status: TournamentStatus.RECRUITMENT,
      organizer,
      event,
      eventMap,
      bannedBrawlers,
      contestants: [organizer],
    });
  }

  async cancelTournament(id: number){
    const queryRunner = this.dbConnection.createQueryRunner();

    await queryRunner.startTransaction();

    // try{
    //   queryRunner.manager.findOne
    // }
  }
}
