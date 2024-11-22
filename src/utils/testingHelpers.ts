import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../users/services/auth/auth.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../database/entities/User.entity";
import { getQueueToken } from "@nestjs/bullmq";
import { Tournament } from "../database/entities/Tournament.entity";
import { Event } from "../database/entities/Event.entity";
import { EventMap } from "../database/entities/EventMap.entity";
import { Brawler } from "../database/entities/Brawler.entity";
import { TournamentsService } from "../tournaments/services/tournaments/tournaments.service";

export const authProviders = [
  AuthService,
  JwtService,
  {
    provide: getRepositoryToken(User),
    useValue: {},
  },
  {
    provide: getQueueToken('brawl-stars-api'),
    useValue: {
    }
  },
];

export const mockDbConnection = {
  createQueryRunner: jest.fn().mockReturnValue({
    manager: {
      find: jest.fn(),
      save: jest.fn(),
    },
    connect: jest.fn(),
    release: jest.fn(),
  }),
  transaction: jest.fn().mockImplementation((cb) => cb()),
};

export const tournamentsServiceProviders = [
  TournamentsService,
  {
    provide: getRepositoryToken(Tournament),
    useValue: {
    }
  },
  {
    provide: getRepositoryToken(Event),
    useValue: {
    }
  },
  {
    provide: getRepositoryToken(EventMap),
    useValue: {
    }
  },
  {
    provide: getRepositoryToken(Brawler),
    useValue: {
    }
  },
];