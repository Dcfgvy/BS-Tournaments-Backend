import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
import { Tournament } from '../../../database/entities/Tournament.entity';
import { TournamentStatus } from '../../enums/tournament-status.enum';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../../../database/entities/User.entity';
import { Event } from '../../../database/entities/Event.entity';
import { EventMap } from '../../../database/entities/EventMap.entity';
import { Brawler } from '../../../database/entities/Brawler.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { Win } from '../../../database/entities/Win.entity';
import { TourChatMessage } from '../../../database/entities/TourChatMessage.entity';
import { createObjectCsvStringifier } from 'csv-writer';
import { formatDate } from '../../../utils/other';
import { SettingsService } from 'src/settings/settings.service';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { _, translatePlace } from 'src/utils/translator';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TourChatMessage)
    private readonly tourChatMessageRepository: Repository<TourChatMessage>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventMap)
    private readonly eventMapRepository: Repository<EventMap>,
    @InjectRepository(Brawler)
    private readonly brawlerRepository: Repository<Brawler>,
    private readonly dbConnection: Connection,
    @InjectQueue('brawl-stars-api')
    private readonly brawlStarsApiQueue: Queue,
    private readonly telegramBotService: TelegramBotService,
    private readonly settingsService: SettingsService,
  ) {}

  async fetchActiveTournaments(
    paginationOptions: IPaginationOptions,
    costFrom: number,
    costTo: number,
    playersNumberFrom: number,
    playersNumberTo: number,
    eventId: number,
    bannedBrawlers: number[],
  ): Promise<Pagination<Tournament>> {
    let query = this.tournamentRepository
      .createQueryBuilder('tournaments')
      .leftJoinAndSelect('tournaments.event', 'event')
      .leftJoinAndSelect('tournaments.eventMap', 'eventMap')
      .leftJoinAndSelect('tournaments.organizer', 'organizer')
      .leftJoinAndSelect('tournaments.bannedBrawlers', 'brawlers')
      .leftJoinAndSelect('tournaments.contestants', 'contestants')
      .where('tournaments.status = :status', {
        status: TournamentStatus.RECRUITMENT,
      })
      .andWhere('tournaments.entryCost BETWEEN :minCost AND :maxCost', {
        minCost: costFrom || 0,
        maxCost: costTo || 1000000,
      })
      .andWhere(
        'tournaments.playersNumber BETWEEN :minPlayers AND :maxPlayers',
        {
          minPlayers: playersNumberFrom || 1,
          maxPlayers: playersNumberTo || 100,
        },
      );

    if (eventId) {
      query = query.andWhere('tournaments.eventId = :eventId', { eventId });
    }

    if (bannedBrawlers && bannedBrawlers.length > 0) {
      query = query.andWhere('brawlers.id IN (:...brawlerIds)', {
        brawlerIds: bannedBrawlers,
      });
    }

    query = query
      .groupBy(
        'tournaments.id, brawlers.id, contestants.id, event.id, eventMap.id, organizer.id',
      )
      .orderBy('tournaments.playersNumber - COUNT(contestants.id)', 'ASC')
      .addOrderBy(
        'EXTRACT(EPOCH FROM (NOW() - tournaments.lastStatusUpdate))',
        'DESC',
      );

    return paginate<Tournament>(query, paginationOptions);
  }

  async fetchAllTournaments(
    paginationOptions: IPaginationOptions,
    costFrom: number,
    costTo: number,
    playersNumberFrom: number,
    playersNumberTo: number,
    eventId: number,
    bannedBrawlers: number[],
    createdFrom: Date,
    createdTo: Date,
    status: TournamentStatus,
    tournamentId: number,
    contestantTags: string[],
  ): Promise<Pagination<Tournament>> {
    let query = this.tournamentRepository
      .createQueryBuilder('tournaments')
      .leftJoinAndSelect('tournaments.event', 'event')
      .leftJoinAndSelect('tournaments.eventMap', 'eventMap')
      .leftJoinAndSelect('tournaments.organizer', 'organizer')
      .leftJoinAndSelect('tournaments.bannedBrawlers', 'brawlers')
      .leftJoinAndSelect('tournaments.contestants', 'contestants');

    // Filters based on cost and number of players
    query = query
      .where('tournaments.entryCost BETWEEN :minCost AND :maxCost', {
        minCost: costFrom || 0,
        maxCost: costTo || 1000000,
      })
      .andWhere(
        'tournaments.playersNumber BETWEEN :minPlayers AND :maxPlayers',
        {
          minPlayers: playersNumberFrom || 1,
          maxPlayers: playersNumberTo || 100,
        },
      );

    // Filter by event ID
    if (eventId) {
      query = query.andWhere('tournaments.eventId = :eventId', { eventId });
    }

    // Filter by banned brawlers
    if (bannedBrawlers && bannedBrawlers.length > 0) {
      query = query.andWhere('brawlers.id IN (:...brawlerIds)', {
        brawlerIds: bannedBrawlers,
      });
    }

    // Filter by creation date range
    if (createdFrom) {
      query = query.andWhere('tournaments.createdAt >= :createdFrom', {
        createdFrom,
      });
    }

    if (createdTo) {
      query = query.andWhere('tournaments.createdAt <= :createdTo', {
        createdTo,
      });
    }

    // Filter by status
    if (status && !isNaN(status)) {
      query = query.andWhere('tournaments.status = :status', { status });
    }

    // Filter by specific tournament ID
    if (tournamentId) {
      query = query.andWhere('tournaments.id = :tournamentId', {
        tournamentId,
      });
    }

    // Filter by contestant tags
    if (contestantTags && contestantTags.length > 0) {
      query = query
        .andWhere('contestants.tag IN (:...contestantTags)', {
          contestantTags,
        });
    }

    query = query.groupBy(
      'tournaments.id, brawlers.id, contestants.id, event.id, eventMap.id, organizer.id',
    );

    // Order by creation date (descending)
    query = query.orderBy('tournaments.id', 'DESC');

    return paginate<Tournament>(query, paginationOptions);
  }

  async fetchUserTournaments(userId: number, active: boolean = true) {
    const tournaments = await this.tournamentRepository.find({
      where: {
        contestants: { id: userId },
        status: active
          ? In([
              TournamentStatus.RECRUITMENT,
              TournamentStatus.WAITING_FOR_START,
              TournamentStatus.STARTED,
            ])
          : In([
              TournamentStatus.CANCELLED,
              TournamentStatus.ENDED,
              TournamentStatus.FROZEN,
            ]),
      },
      relations: ['event', 'eventMap', 'contestants', 'organizer'],
    });
    return tournaments;
  }

  async fetchTournamentById(id: number, tournamentStatusCodes: TournamentStatus[]): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: {
        id: id || -1,
        status: tournamentStatusCodes.length > 0 ? In(tournamentStatusCodes) : undefined
      },
      relations: ['event', 'eventMap', 'contestants', 'organizer'],
    });
    return tournament;
  }

  async checkUserParticipation(user: User) {
    const tournaments = await this.tournamentRepository.findBy({
      contestants: { id: user.id },
      status: In([
        TournamentStatus.RECRUITMENT,
        TournamentStatus.WAITING_FOR_START,
        TournamentStatus.STARTED,
      ]),
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
    const event = await this.eventRepository.findOneBy({
      id: eventId,
      isDisabled: false,
    });
    if (!event)
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);

    // playersNumber exists as a players number option for the event
    if (!event.playersNumberOptions.includes(playersNumber))
      throw new HttpException(
        'Players number is not available for this event',
        HttpStatus.BAD_REQUEST,
      );

    // eventMap for the event should exist
    const eventMap = await this.eventMapRepository.findOne({
      where: {
        id: eventMapId,
        event: {
          id: event.id,
        },
      },
      relations: ['event'],
    });
    if (!eventMap)
      throw new HttpException('Event map not found', HttpStatus.BAD_REQUEST);

    // all bannedBrawlers should exist
    const bannedBrawlers = await this.brawlerRepository.findBy({
      id: In(bannedBrawlesIds),
    });
    if (bannedBrawlers.length !== bannedBrawlesIds.length)
      throw new HttpException(
        'Some brawlers not found',
        HttpStatus.BAD_REQUEST,
      );

    // sort prizes in descending order
    prizes.sort((a, b) => b - a);

    // check if sum of all prized does not exceed
    //       entryCost * (playersNumber - 1 (one player is the organizer, so he/she doesn't count)) - fee
    if (
      (prizes.reduce((prev, curr) => prev + curr) + SettingsService.data.tourCreationFee) >
      entryCost * (playersNumber - 1)
    )
      throw new HttpException(
        "Sum of all prizes + tournament fee cannot be more than all entries' costs",
        HttpStatus.BAD_REQUEST,
      );

    // check if prizes are equal for every team's members (in case it is a team event)
    if(!event.isSolo){
      if(prizes.length % event.teamSize !== 0)
        throw new HttpException('Prizes must be equal for every team member', HttpStatus.BAD_REQUEST);

      for (let i = 0; i < prizes.length; i++) {
        if (prizes[i] !== prizes[ event.teamSize * (Math.floor(i % event.teamSize)) ])
          throw new HttpException('Prizes must be equal for every team member', HttpStatus.BAD_REQUEST);
      }
    }

    // check if user already participates in another tournament
    if (await this.checkUserParticipation(organizer))
      throw new HttpException(
        'User already participates in another tournament',
        HttpStatus.CONFLICT,
      );

    // finally create a new tournament
    const newTournament = this.tournamentRepository.create({
      entryCost,
      playersNumber,
      prizes,
      status: TournamentStatus.RECRUITMENT,
      feeToPay: SettingsService.data.tourCreationFee,
      organizer,
      event,
      eventMap,
      bannedBrawlers,
      contestants: [organizer],
    });
    await this.tournamentRepository.save(newTournament);
    await this.publishTournamentPost(newTournament);
  }

  async publishTournamentPost(tournament: Tournament): Promise<void> {
    const channels = await this.settingsService.getChannelsToPost();
    for (const channel of channels) {
      const lang = channel.language;
      let caption = _('Tournament post', lang, {
        eventName: JSON.parse(tournament.event.names)[lang],
        mapName: JSON.parse(tournament.eventMap.names)[lang],
        entryCost: tournament.entryCost,
        playersNumber: tournament.playersNumber,
      });
      const tab = '     ';
      caption += `\n\n${tab}` + tournament.prizes.map((prize, index) => translatePlace(index + 1, lang, { prize })).join(`\n${tab}`);
      await this.telegramBotService.sendMessage('@' + channel.username, caption);
    }
  }

  async signUpForTournament(userId: number, tournamentId: number) {
    const queryRunner = this.dbConnection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Acquire lock on the tournament row to prevent concurrent modifications.
      const tournament = await queryRunner.manager.findOne(Tournament, {
        where: { id: tournamentId, status: TournamentStatus.RECRUITMENT },
        relations: ['contestants'],
        lock: { mode: 'pessimistic_write' }, // This locks the row until the transaction is completed
      });

      if (!tournament)
        throw new HttpException(
          'Tournament not found or already started',
          HttpStatus.BAD_REQUEST,
        );

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      if (await this.checkUserParticipation(user))
        throw new HttpException(
          'User already participates in another tournament',
          HttpStatus.CONFLICT,
        );

      if (user.balance < tournament.entryCost)
        throw new HttpException(
          'Not enough funds',
          HttpStatus.PAYMENT_REQUIRED,
        );

      if (tournament.contestants.length >= tournament.playersNumber)
        throw new HttpException(
          'Tournament is already full',
          HttpStatus.CONFLICT,
        );

      user.balance -= tournament.entryCost;
      tournament.contestants.push(user);

      if (tournament.contestants.length === tournament.playersNumber) {
        tournament.status = TournamentStatus.WAITING_FOR_START;
      }

      await queryRunner.manager.save(tournament);
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateTournamentLink(
    userId: number,
    tournamentId: number,
    inviteCode: string,
  ) {
    const tournament = await this.tournamentRepository.findOne({
      where: {
        id: tournamentId,
        status: In([
          TournamentStatus.WAITING_FOR_START,
          TournamentStatus.STARTED,
        ]),
        organizer: {
          id: userId,
        },
      },
      relations: ['organizer'],
    });
    if (!tournament)
      throw new HttpException('Tournament not found', HttpStatus.NOT_FOUND);

    tournament.inviteCode = inviteCode;
    if (tournament.status === TournamentStatus.WAITING_FOR_START)
      tournament.status = TournamentStatus.STARTED;

    return this.tournamentRepository.save(tournament);
  }

  async finishTournament(
    userId: number,
    tournamentId: number,
    winners: string[],
  ): Promise<void> {
    winners = winners.map((winner) => winner.toUpperCase());
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();

    const tournament = await queryRunner.manager
      .createQueryBuilder(Tournament, 'tournament')
      .leftJoinAndSelect('tournament.event', 'event')
      .leftJoinAndSelect('tournament.eventMap', 'eventMap')
      .leftJoinAndSelect('tournament.organizer', 'organizer')
      .leftJoinAndSelect('tournament.contestants', 'contestants')
      .leftJoinAndSelect('tournament.bannedBrawlers', 'bannedBrawlers')
      .leftJoinAndSelect('tournament.wins', 'wins')
      .where('tournament.id = :tournamentId', { tournamentId })
      .andWhere('organizer.id = :organizerId', { organizerId: userId })
      .andWhere('tournament.status = :status', {
        status: TournamentStatus.STARTED,
      })
      .andWhere('array_length(tournament.prizes, 1) = :length', {
        length: winners.length,
      })
      .getOne();
    if (!tournament) {
      await queryRunner.release();
      throw new HttpException('Tournament not found', HttpStatus.NOT_FOUND);
    }

    const queueEvents = new QueueEvents('brawl-stars-api');
    const confirmationJob = await this.brawlStarsApiQueue.add(
      'confirm-winners',
      {
        organizerTag: tournament.organizer.tag,
        event: tournament.event.apiName,
        eventMap: tournament.eventMap.apiName,
        bannedBrawlers: tournament.bannedBrawlers.map(
          (brawler) => brawler.apiName,
        ),
        winners: winners,
        teamSize: tournament.event.teamSize,
      },
    );
    try {
      const areWinnersCorrect: boolean =
        await confirmationJob.waitUntilFinished(queueEvents);
      if (!areWinnersCorrect) throw new Error('Incorrect winners');
    } catch (error) {
      throw new HttpException('Incorrect winners', HttpStatus.BAD_REQUEST);
    }

    await queryRunner.startTransaction();

    try {
      tournament.status = TournamentStatus.FROZEN;
      for (let i = 0; i < winners.length; i++) {
        const user = await queryRunner.manager.findOneBy(User, {
          tag: winners[i],
        });
        if (user) {
          const win = queryRunner.manager.create(Win, {
            place: i + 1,
            tournament,
            user,
          });
          await queryRunner.manager.save(win);
          tournament.wins = [...tournament.wins, win];
        }
      }
      await queryRunner.manager.save(tournament);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async cancelTournament(id: number) {
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();

    const tournament = await queryRunner.manager.findOne(Tournament, {
      where: {
        id,
        status: In([
          TournamentStatus.RECRUITMENT,
          TournamentStatus.WAITING_FOR_START,
          TournamentStatus.STARTED,
          TournamentStatus.FROZEN,
        ]),
      },
      relations: ['organizer', 'contestants'],
    });
    if (!tournament) {
      await queryRunner.release();
      throw new HttpException('Tournament not found', HttpStatus.NOT_FOUND);
    }

    await queryRunner.startTransaction();

    try {
      tournament.status = TournamentStatus.CANCELLED;
      for (let i = 0; i < tournament.contestants.length; i++) {
        const contestant = tournament.contestants[i];
        if (contestant.id !== tournament.organizer.id) {
          contestant.balance += tournament.entryCost;
          await queryRunner.manager.save(contestant);
        }
      }
      await queryRunner.manager.save(tournament);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async endTournament(id: number) {
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();

    const tournament = await queryRunner.manager.findOne(Tournament, {
      where: {
        id,
        status: TournamentStatus.FROZEN,
      },
      relations: ['wins', 'organizer'],
    });
    if (!tournament) {
      await queryRunner.release();
      throw new HttpException('Tournament not found', HttpStatus.NOT_FOUND);
    }

    await queryRunner.startTransaction();

    try {
      tournament.status = TournamentStatus.ENDED;
      let prizes_sum = 0;
      for (let i = 0; i < tournament.wins.length; i++) {
        const win = tournament.wins[i];
        const winner = tournament.wins[i].user;
        const prize = tournament.prizes[win.place - 1] || 0;
        winner.balance += prize;
        prizes_sum += prize;
        await queryRunner.manager.save(winner);
      }
      tournament.organizer.balance += tournament.entryCost * (tournament.playersNumber - 1) - prizes_sum - tournament.feeToPay;
      await queryRunner.manager.save(tournament.organizer);
      await queryRunner.manager.save(tournament);
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async exportChatToCSV(tournamentId: number): Promise<string> {
    const chatMessages = await this.tourChatMessageRepository.find({
      where: {
        tournament: {
          id: tournamentId
        }
      },
      order: { createdAt: 'ASC' },
      relations: ['user'],
    });

    let data = [];
    for(const message of chatMessages){
      data.push({
        createdAt: formatDate(message.createdAt),
        user_id: message.user.id,
        user_tag: message.user.tag,
        text: message.text,
      })
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'createdAt', title: 'Time of sending' },
        { id: 'user_id', title: 'Sender ID' },
        { id: 'user_tag', title: 'Sender tag' },
        { id: 'text', title: 'Message' },
      ],
    });
    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);
    return csvContent;
  }
}
