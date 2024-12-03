import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { RegisterFormDto } from '../../dtos/RegisterForm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginFormDto } from '../../dtos/LoginForm.dto';
import { v4 as uuidv4, v4 } from 'uuid';
import { UserRole } from '../../enums/role.enum';
import { User } from '../../../database/entities/User.entity';
import { comparePasswords, hashPassword } from '../../../utils/bcrypt';
import { RefreshTokenDto } from '../../dtos/RefreshToken.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { validateTgUserPayload } from 'src/utils/other';
import { TgLoginFormDto } from 'src/users/dtos/TgLoginForm.dto';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { _ } from 'src/utils/translator';
import { TelegramConnectionLink } from 'src/database/entities/TelegramConnectionLink.entity';
import { ChangePasswordDto } from 'src/users/dtos/ChangePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(TelegramConnectionLink)
    private telegramConnectionLinkRepository: Repository<TelegramConnectionLink>,
    private jwtService: JwtService,
    @InjectQueue('brawl-stars-api') private brawlStarsApiQueue: Queue,
    private readonly telegramBotService: TelegramBotService,
  ){}

  async register(registerFormDto: RegisterFormDto, ip: string){
    const userTag = registerFormDto.tag;
    const user: User = await this.userRepository.findOneBy({
      tag: userTag
    });
    if(!user){
      const tgData = registerFormDto.telegramData;
      if(tgData && (validateTgUserPayload(tgData) === false))
        throw new HttpException('Invalid Telegram data', HttpStatus.BAD_REQUEST);

      const queueEvents = new QueueEvents('brawl-stars-api');
      const confirmationJob = await this.brawlStarsApiQueue.add('confirm-account-by-tag', {
        tag: userTag,
        trophyChange: registerFormDto.trophyChange
      });
      const confirmedUserName: string = await confirmationJob.waitUntilFinished(queueEvents);
      
      if(confirmedUserName){
        const newUser = this.userRepository.create({
          tag: userTag,
          name: confirmedUserName,
          password: hashPassword(registerFormDto.password),
          telegramId: tgData ? tgData.user.id : null,
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
      tag: tag.toUpperCase()
    });
    if(user && comparePasswords(password, user.password)){
      return user;
    } else {
      return null;
    }
  }

  async createTokens(user: User): Promise<any> {
    if(user){
      const accessPayload = { id: user.id, uuid: uuidv4() };
      const refreshPayload = { id: user.id, uuid: uuidv4() };
      return {
        tokenType: 'Bearer',
        accessToken: this.jwtService.sign(accessPayload, { expiresIn: 3600 }),
        expiresIn: 3600,
        refreshToken: this.jwtService.sign(refreshPayload, { expiresIn: '30d' }),
      };
    }
    else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginFromDto: LoginFormDto){
    const user: User = await this.validateUser(loginFromDto.tag, loginFromDto.password);
    return this.createTokens(user);
  }

  async loginViaTelegram(loginFormDto: TgLoginFormDto){
    const tgData = loginFormDto.telegramData;
    if(validateTgUserPayload(tgData) === false)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const user: User = await this.userRepository.findOneBy({ telegramId: tgData.user.id });
    if(user){
      return this.createTokens(user);
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
    return this.createTokens(user);
  }

  async changePassword(user: User, data: ChangePasswordDto): Promise<void> {
    if(comparePasswords(data.oldPassword, user.password)){
      user.password = hashPassword(data.newPassword);
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);
    }
  }

  async processUserIpAddress(req: any, user: User): Promise<void> {
    const request_ip: string =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] || '';
    if(request_ip.length > 0 && user.ip != request_ip){
      user.ip = request_ip;
      await this.userRepository.save(user);
    }
  }

  async validateRequest(req: Request): Promise<boolean> {
    if(!(req['user']))
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    if(req['user'].isBanned)
      throw new HttpException('User banned', HttpStatus.FORBIDDEN);
    return true;
  }

  async validateRequestByRole(req: Request, role: UserRole): Promise<boolean> {
    const authCheck = await this.validateRequest(req);
    if(authCheck){
      if(!( req['user'].roles.includes(role) )) throw new HttpException('Access forbidden', HttpStatus.FORBIDDEN);
      return true;
    }
    throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
  }

  async generateTelegramAccountConnectionLink(user: User): Promise<string> {
    const uid = String(new Date().getTime()) + String(user.id) + v4();
    const dbLink = this.telegramConnectionLinkRepository.create({
      uid: uid,
      user: user
    });
    await this.telegramConnectionLinkRepository.save(dbLink);
    return `https://t.me/${this.telegramBotService.botUsername}?start=${uid}`;
  }

  async unlinkTelegramAccount(user: User): Promise<void> {
    if(!user.telegramId) throw new HttpException('No Telegram account connected', HttpStatus.METHOD_NOT_ALLOWED);
    const oldTgId = user.telegramId;
    user.telegramId = null;
    await this.userRepository.save(user);
    this.telegramBotService.sendMessage(
      oldTgId,
      _("This Telegram account has been unlinked. You can now log in only using your tag and password.", user.language)
    );
  }
}