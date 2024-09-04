import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { RegisterFormDto } from '../../dtos/RegisterForm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginFormDto } from '../../dtos/LoginForm.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../enums/role.enum';
import { User } from '../../../typeorm/entities/User.entity';
import { BrawlStarsApiService } from '../../../services/brawl-stars-api/brawl-stars-api.service';
import { comparePasswords, hashPassword } from '../../../utils/bcrypt';
import { RefreshTokenDto } from '../../dtos/RefreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private brawlStarsApiService: BrawlStarsApiService
  ){}

  async register(registerFormDto: RegisterFormDto, ip: string){
    const userTag: string = registerFormDto.tag;
    const user: User = await this.userRepository.findOneBy({
      tag: userTag
    });
    if(!user){
      const account_confirmed: boolean = await this.brawlStarsApiService.confirmAccountByTag(userTag, registerFormDto.trophyChange);
      if(account_confirmed){
        const userName = await this.brawlStarsApiService.getBSName(userTag);
        const newUser = this.userRepository.create({
          tag: userTag,
          name: userName,
          password: hashPassword(registerFormDto.password),
          language: registerFormDto.language,
          ip: ip,
        });
        const finalUser = await this.userRepository.save(newUser);
        return finalUser;
      }
      throw new HttpException('Invalid trophy change', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('User with this tag already exists', HttpStatus.CONFLICT);
    }
  }

  async validateUser(tag: string, password: string): Promise<User>{
    const user: User = await this.userRepository.findOneBy({
      tag
    });
    if(user && comparePasswords(password, user.password)){
      return user;
    } else {
      return null;
    }
  }

  async login(loginFromDto: LoginFormDto){
    const user: User = await this.validateUser(loginFromDto.tag, loginFromDto.password);
    if(user){
      const accessPayload = { id: user.id, uuid: uuidv4() };
      const refreshPayload = { id: user.id, uuid: uuidv4() };
      return {
        tokenType: 'Bearer',
        accessToken: this.jwtService.sign(accessPayload, { expiresIn: '1h' }),
        expiresIn: 3600,
        refreshToken: this.jwtService.sign(refreshPayload),
      };
    }
    else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async updateToken(refreshTokenDto: RefreshTokenDto){
    let payload: { id: number };
    try {
      payload = this.jwtService.verify(refreshTokenDto.refreshToken);
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.userRepository.findOneBy({ id: payload.id });
    if(user){
      const accessPayload = { id: payload.id, timestamp: new Date().getTime() };
      const refreshPayload = { id: payload.id, timestamp: new Date().getTime() + 1 };
      return {
        tokenType: 'Bearer',
        accessToken: this.jwtService.sign(accessPayload, { expiresIn: '1h' }),
        expiresIn: 3600,
        refreshToken: this.jwtService.sign(refreshPayload),
      };
    } else {
      throw new HttpException('Invalid refresh token', HttpStatus.NOT_FOUND);
    }
  }

  async validateRequest(req: Request): Promise<boolean> {
    const token = req.headers['authorization']?.split(' ')[1];
    if(token){
      let payload: { id: number };
      try {
        payload = this.jwtService.verify(token);
      } catch (error) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const user: User = await this.userRepository.findOneBy({ id: payload.id });
      if(user){
        const request_ip: string =
          req.headers['cf-connecting-ip'] ||
          req.headers['x-real-ip'] ||
          req.headers['x-forwarded-for'] || '';
        if(request_ip.length > 0 && user.ip != request_ip){
          user.ip = request_ip;
          await this.userRepository.save(user);
        }
        req['user'] = user;
        return true;
      } else {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateRequestByRole(req: Request, role: UserRole): Promise<boolean> {
    const authCheck = await this.validateRequest(req);
    if(authCheck){
      if(!( req['user'].roles.includes(role) )) throw new HttpException('Access forbidden', HttpStatus.FORBIDDEN);
      return true;
    }
    throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
  }
}