import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../typeorm/entities/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const payload = this.jwtService.verify<{ id: number }>(token);
        const user: User = await this.userRepository.findOneBy({ id: payload.id });

        if (user) {
          await this.authService.processUserIpAddress(req, user);
          req['user'] = user;
        }
      } catch (error) {
        // ignore
      }
    }

    next();
  }
}
