import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });

    this.initializeBot();
  }

  initializeBot() {
    this.bot.onText(/\/subscribe/, async (msg) => {
      const chatId = msg.chat.id;
      const username =
        msg.from?.username || (await this.askForUsername(chatId));
      const existingUser = await this.userModel.findOne({ chatId });
      if (existingUser) {
        this.bot.sendMessage(chatId, 'You are already subscribed!');
      } else {
        const newUser = new this.userModel({ chatId, username });
        await newUser.save();
        this.bot.sendMessage(
          chatId,
          `You have successfully subscribed with the username: ${username}`,
        );
      }
    });

    this.bot.onText(/\/unsubscribe/, async (msg) => {
      const chatId = msg.chat.id;

      await this.userModel.deleteOne({ chatId });
      this.bot.sendMessage(chatId, 'You have successfully unsubscribed.');
    });
  }

  private async askForUsername(chatId: number): Promise<string> {
    this.bot.sendMessage(chatId, 'Please provide a username.');

    return new Promise((resolve) => {
      this.bot.once('message', (msg) => {
        resolve(msg.text);
      });
    });
  }
}
