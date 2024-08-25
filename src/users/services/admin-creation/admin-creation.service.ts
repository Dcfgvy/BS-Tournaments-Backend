import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import { appConfig } from 'src/utils/appConfigs';
import { hashPassword } from 'src/utils/bcrypt';
import { UserRole } from 'src/users/enums/role.enum';

@Injectable()
export class AdminCreationService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const existingUser = await this.userRepository.findOne({
      where: { tag: appConfig.ADMIN_TAGNAME },
    });
    if (!existingUser) {
      const hashedPassword = hashPassword(appConfig.ADMIN_PASSWORD);
      const adminUser = this.userRepository.create({
        tag: appConfig.ADMIN_TAGNAME,
        password: hashedPassword,
        balance: 10000,
        name: 'Admin',
        language: 'en',
        ip: 'localhost',
        roles: [UserRole.User, UserRole.Admin]
      });
      await this.userRepository.save(adminUser);
    }
  }
}
