import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Telegraf } from 'telegraf';
import { TelegramConnectionLink } from 'src/database/entities/TelegramConnectionLink.entity';
import { User } from 'src/database/entities/User.entity';
import { appConfig } from 'src/utils/appConfigs';
import { Repository } from 'typeorm';
import { _ } from 'src/utils/translator';

@Injectable()
export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  public botUsername: string;
  private readonly logger: Logger = new Logger(TelegramBotService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TelegramConnectionLink)
    private readonly telegramConnectionLinkRepository: Repository<TelegramConnectionLink>,
  ) {
    this.bot = new Telegraf(appConfig.TELEGRAM_BOT_TOKEN);
  }

  async onModuleInit() {
    this.bot.command('start', async (ctx) => {
      const uid: string = ctx.message?.text?.split(' ')[1]; // Extract the parameter after /start
      if(!uid){
        return ctx.reply(_(
          "Hi, username, you didn't provide the verification data",
          ctx.from.language_code,
          { username: ctx.from.first_name }
        ));
      }
      const link = await this.telegramConnectionLinkRepository.findOneBy({ uid });
      if(!link){
        return ctx.reply(_(
          "The link is invalid or expired. Please try again",
          ctx.from.language_code,
        ));
      }
      const usersWithThisTgId = await this.userRepository.findBy({ telegramId: ctx.from.id });
      if(usersWithThisTgId.length > 0){
        return ctx.reply(_(
          "This Telegram account is already in use by another account",
          ctx.from.language_code,
        ));
      }

      const user = link.user;
      user.telegramId = ctx.from.id;
      await this.telegramConnectionLinkRepository.delete(link);
      await this.userRepository.save(user);
      await ctx.reply(_("Your Telegram account was successfully connected", user.language));
    });

    this.launchBot();
    this.getName();
  }

  onModuleDestroy() {
    this.bot.stop();
    this.logger.log('Telegram bot stopped.');
  }

  private launchBot(){
    this.bot.launch()
    .then(() => {
      this.logger.log('Telegram bot started.');
    })
    .catch((error) => {
      setTimeout(() => this.launchBot(), 500);
    });
  }

  private getName(){
    this.bot.telegram.getMe()
    .then((botInfo) => {
      this.botUsername = botInfo.username;
    }).catch((error) => {
      setTimeout(() => this.getName(), 500);
    });
  }

  async sendMessage(chatId: number | string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message, {
      parse_mode: 'HTML',
    });
  }
}
