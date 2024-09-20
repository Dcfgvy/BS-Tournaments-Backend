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
    const event = await this.eventsRepository.findOneBy({ id: eventId, isDisabled: false });
    if(!event) throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);

    // playersNumber exists as a players number option for the event
    if(!event.playersNumberOptions.includes(playersNumber))
      throw new HttpException('Players number is not available for this event', HttpStatus.BAD_REQUEST);

    // eventMap for the event should exist
    const eventMap = await this.eventMapsRepository.findOne({
      where: {
        id: eventMapId,
        event: {
          id: event.id
        }
      },
      relations: ['event']
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
    const newTournament = this.tournamentsRepository.create({
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
    return this.tournamentsRepository.save(newTournament);
  }

  async signUpForTournament(userId: number, tournamentId: number){
    const queryRunner = this.dbConnection.createQueryRunner();

    const user = await queryRunner.manager.findOneBy(User, { id: userId });
    if(await this.checkUserParticipation(user))
      throw new HttpException('User already participates in another tournament', HttpStatus.CONFLICT);

    const tournament = await this.tournamentsRepository.manager.findOne(Tournament, {
      where: {
        id: tournamentId,
        status: TournamentStatus.RECRUITMENT
      },
      relations: ['contestants']
    });
    if(!tournament) throw new HttpException('Tournament not found or already started', HttpStatus.BAD_REQUEST);

    if(user.balance < tournament.entryCost)
      throw new HttpException('Not enough funds', HttpStatus.PAYMENT_REQUIRED);

    await queryRunner.startTransaction();

    try{
      user.balance -= tournament.entryCost;
      tournament.contestants = [...tournament.contestants, user];

      if(tournament.contestants.length === tournament.playersNumber){
        tournament.status = TournamentStatus.WAITING_FOR_START;
      }
      await queryRunner.manager.save(tournament);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return;
    } catch (err){
      await queryRunner.rollbackTransaction();
      throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally{
      await queryRunner.release();
    }
  }

  async cancelTournament(id: number){
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.startTransaction();

    const tournament = await queryRunner.manager.findOne(Tournament, {
      where: {
        id,
        status: In([TournamentStatus.RECRUITMENT, TournamentStatus.WAITING_FOR_START, TournamentStatus.STARTED, TournamentStatus.FROZEN])
      },
      relations: ['organizer', 'contestants']
    });
    if(!tournament) throw new HttpException('Tournament not found', HttpStatus.NOT_FOUND);

    try{
      tournament.status = TournamentStatus.CANCELLED;
      for(let i = 0; i < tournament.contestants.length; i++){
        const contestant = tournament.contestants[i];
        if(contestant.id !== tournament.organizer.id){
          contestant.balance += tournament.entryCost;
          await queryRunner.manager.save(contestant);
        }
      }
      await queryRunner.manager.save(tournament);
      await queryRunner.commitTransaction();
      return;
    } catch (err){
      await queryRunner.rollbackTransaction();
      throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally{
      await queryRunner.release();
    }
  }

  async endTournament(id: number){
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.startTransaction();

    const tournament = await queryRunner.manager.findOne(Tournament, {
      where: {
        id,
        status: TournamentStatus.FROZEN
      },
      relations: ['wins']
    });
    if(!tournament) throw new HttpException('Tournament not found', HttpStatus.NOT_FOUND);

    try{
      tournament.status = TournamentStatus.ENDED;
      for(let i = 0; i < tournament.wins.length; i++){
        const win = tournament.wins[i];
        const winner = tournament.wins[i].user;
        winner.balance += tournament.prizes[win.place - 1] || 0;
        await queryRunner.manager.save(winner);
      }
      await queryRunner.manager.save(tournament);
      await queryRunner.commitTransaction();
      return;
    } catch (err){
      await queryRunner.rollbackTransaction();
      throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally{
      await queryRunner.release();
    }
  }
}
