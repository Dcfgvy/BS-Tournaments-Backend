import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/User.entity';
import { appConfig } from '../../../utils/appConfigs';
import { UserRole } from '../../enums/role.enum';
import { hashPassword } from '../../../utils/bcrypt';

@Injectable()
export class AdminCreationService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const existingUser = await this.userRepository.findOne({
      where: { tag: appConfig.ADMIN_TAGNAME },
    });
    const hashedPassword = hashPassword(appConfig.ADMIN_PASSWORD);
    if (!existingUser) {
      const adminUser = this.userRepository.create({
        tag: appConfig.ADMIN_TAGNAME,
        password: hashedPassword,
        balance: 10000,
        name: 'Admin',
        language: 'en',
        ip: 'localhost',
        roles: [UserRole.USER, UserRole.ADMIN]
      });
      await this.userRepository.save(adminUser);
    }
    else {
      existingUser.password = hashedPassword;
      await this.userRepository.save(existingUser);
    }
  }
}
