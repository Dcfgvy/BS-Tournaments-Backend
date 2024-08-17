import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [AuthModule, TypeOrmModule.forFeature([User])]
})
export class AuthModule {}
