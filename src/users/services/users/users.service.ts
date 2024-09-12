import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User.entity';
import { Not, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { appConfig } from '../../../utils/appConfigs';

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
    const user = await this.userRepository.findOneBy({ id });
    if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.isBanned = false;
    user.bannedUntil = new Date();
    return this.userRepository.save(user);
  }
}
