import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BgUnbanService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'unban_users'
  })
  checkForUsersToUnban(){
    return this.userRepository.update({
      isBanned: true,
      bannedUntil: LessThanOrEqual(new Date())
    }, {
      isBanned: false,
    });
  }
}
