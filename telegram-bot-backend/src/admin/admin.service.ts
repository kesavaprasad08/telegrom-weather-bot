import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Config, ConfigDocument } from 'src/schemas/config.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async blockUser(telegramId: string): Promise<any> {
    return this.userModel.updateOne(
      { chatId: telegramId },
      { isBlocked: true },
    );
  }
  async unBlockUser(telegramId: string): Promise<any> {
    return this.userModel.updateOne(
      { chatId: telegramId },
      { isBlocked: false },
    );
  }

  async deleteUser(id: string): Promise<any> {
    return this.userModel.findOneAndDelete({ chatId: id });
  }
  async updateTelegramBotToken(token: string): Promise<Config> {
    const config = await this.configModel.findOneAndUpdate(
      {},
      { telegramToken: token },
      { new: true, upsert: true },
    );
    return config;
  }
  async updateOpenWeatherApiKey(token: string): Promise<Config> {
    const config = await this.configModel.findOneAndUpdate(
      {},
      { weatherApiKey: token },
      { new: true, upsert: true },
    );
    return config;
  }
}
