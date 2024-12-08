import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../database/entities/User.entity';
import { Connection, Not, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { appConfig } from '../../../utils/appConfigs';
import { UserRole } from '../../enums/role.enum';
import { SettingsService } from 'src/settings/settings.service';
import { Purchase } from 'src/database/entities/payments/Purchase.entity';
import { TagUpperCasePipe } from 'src/users/pipes/tag-uppercase.pipe';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dbConnection: Connection,
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

  async updateUserRoles(id: number, roles: UserRole[]){
    if(!roles.includes(UserRole.ADMIN)) throw new HttpException('Invalid roles', HttpStatus.BAD_REQUEST);
    const user = await this.userRepository.findOneBy({
      id,
      tag: Not(appConfig.ADMIN_TAGNAME.toUpperCase())
    });
    
    if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    user.roles = roles;
    await this.userRepository.save(user);
  }

  async becomeOrganizer(id: number){
    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();

    const user = await queryRunner.manager.findOneBy(User, { id });
    try {
      if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      if(user.roles.includes(UserRole.ORGANIZER)) throw new HttpException('Already an organizer', HttpStatus.CONFLICT);
      if(user.balance < SettingsService.data.organizerFee) throw new HttpException('Not enough funds', HttpStatus.PAYMENT_REQUIRED);
    } catch (err) {
      await queryRunner.release();
      throw err;
    }

    await queryRunner.startTransaction();

    try{
      user.roles = [...user.roles, UserRole.ORGANIZER];
      user.balance = user.balance - SettingsService.data.organizerFee;
      await queryRunner.manager.save(user);

      const purchase = queryRunner.manager.create(Purchase, {
        type: 'Organizer role',
        cost: SettingsService.data.organizerFee,
        user: user
      });
      await queryRunner.manager.save(purchase);

      await queryRunner.commitTransaction();
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    finally {
      await queryRunner.release();
    }
  }
}
