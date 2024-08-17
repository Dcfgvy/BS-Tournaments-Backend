import { HttpCode, HttpException, Injectable } from '@nestjs/common';
import { RegisterFormDto } from './dtos/RegisterForm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import { Repository } from 'typeorm';
import { HttpStatusCode } from 'axios';
import { hashPassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>){}

  async register(registerFormDto: RegisterFormDto){
    const user: User = await this.userRepository.findOneBy({
      username: registerFormDto.username
    });
    if(!user){
      const newUser = this.userRepository.create({
        username: registerFormDto.username,
        password: hashPassword(registerFormDto.password),
        language: registerFormDto.language
      });
      const finalUser = await this.userRepository.save(newUser);
      return finalUser;
    } else {
      throw new HttpException('User with this username already exists', HttpStatusCode.Conflict);
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {

  }
}
