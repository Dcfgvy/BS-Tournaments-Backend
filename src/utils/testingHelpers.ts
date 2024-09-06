import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../users/services/auth/auth.service";
import { BrawlStarsApiService } from "../services/brawl-stars-api/brawl-stars-api.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../typeorm/entities/User.entity";

export const authProviders = [
  AuthService,
  JwtService,
  BrawlStarsApiService,
  {
    provide: getRepositoryToken(User),
    useValue: {},
  },
];
