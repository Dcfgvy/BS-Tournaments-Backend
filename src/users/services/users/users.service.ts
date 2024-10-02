import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User.entity';
import { Not, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { appConfig } from '../../../utils/appConfigs';
import { UserRole } from '../../enums/role.enum';
import { GlobalSettings } from '../../../services/settings/settings.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  fetchAllUsers(
    paginationOptions: IPaginationOptions,
    tag?: string,
  ) {
    const query = this.userRepository.createQueryBuilder('user');
    query.where('user.tag != :adminTag', { adminTag: appConfig.ADMIN_TAGNAME })
    if (tag) {
      query.andWhere('user.tag ILIKE :tag', { tag: `%#${tag}%` });
    }
    query.orderBy('user.id', 'DESC');
    return paginate<User>(query, paginationOptions);
  }

  async banUser(id: number, bannedUntil?: Date){
    const user = await this.userRepository.findOneBy({
      id,
      tag: Not(appConfig.ADMIN_TAGNAME)
    });
    if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.isBanned = true;
    user.bannedUntil = bannedUntil || null;
    return this.userRepository.save(user);
  }

  async unbanUser(id: number){
    const user = await this.userRepository.findOneBy({
      id,
      isBanned: true
    });
    if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.isBanned = false;
    user.bannedUntil = new Date();
    return this.userRepository.save(user);
  }

  async becomeOrganizer(id: number){
    const user = await this.userRepository.findOneBy({ id });
    
    if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if(user.balance < GlobalSettings.data.organizerFee) throw new HttpException('Not enough funds', HttpStatus.PAYMENT_REQUIRED);
    if(user.roles.includes(UserRole.ORGANIZER)) throw new HttpException('Already an organizer', HttpStatus.CONFLICT);

    user.roles = [...user.roles, UserRole.ORGANIZER];
    user.balance = user.balance - GlobalSettings.data.organizerFee;
    await this.userRepository.save(user);
    return;
  }
}
