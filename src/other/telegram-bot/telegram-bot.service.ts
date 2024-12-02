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
    // Set up bot command listener for /start
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

      const user = link.user;
      user.telegramId = ctx.from.id;
      await this.telegramConnectionLinkRepository.delete(link);
      await this.userRepository.save(user);
      await ctx.reply(_("Your Telegram account was successfully connected", user.language));
    });

    // Handle other messages or commands
    // this.bot.on('text', async (ctx) => {
    //   await ctx.reply('I only respond to /start commands.');
    // });

    // Use setImmediate to avoid blocking NestJS startup
    setImmediate(async () => {
      await this.bot.launch();
      this.logger.log('Telegram bot initialized and polling.');
    });
  }

  onModuleDestroy() {
    // Gracefully stop the bot
    this.bot.stop();
    this.logger.log('Telegram bot stopped.');
  }

  // Utility method to send messages
  async sendMessage(chatId: number, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
