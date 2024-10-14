import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Cron } from '@nestjs/schedule';
import { Config, ConfigDocument } from '../schemas/config.schema';

import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private bot: TelegramBot;
  private token: string;
  private apiKey: string;
  private changeStream: any;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
  ) {}

  async onModuleInit() {
    const config = await this.configModel.findOne();
    if (!config) {
      throw new Error('Configuration not found in the database.');
    }
    this.token = config.telegramToken;
    this.apiKey = config.weatherApiKey;
    this.bot = new TelegramBot(this.token, { polling: true });
    this.setupBot();
    this.initializeChangeStream();
  }
  private async loadConfig() {
    const config = await this.configModel.findOne();
    if (!config) {
      throw new Error('Configuration not found in the database.');
    }

    this.token = config.telegramToken;
    this.apiKey = config.weatherApiKey;
  }
  private initializeChangeStream() {
    this.changeStream = this.configModel.watch();
    this.changeStream.on('change', async (change: any) => {
      if (change.operationType === 'update') {
        await this.loadConfig();
      }
    });
  }
  onModuleDestroy() {
    if (this.changeStream) {
      this.changeStream.close();
    }
  }

  private setupBot() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        const existingUser = await this.userModel.findOne({ chatId });
        if (existingUser && existingUser.isActive) {
          this.bot.sendMessage(
            chatId,
            `You're already subscribed! 
- /get_live_weather_update: Receive the latest weather update.
- /change_city: Update your city preferences.
- /unsubscribe: Stop receiving updates.`,
          );
          return;
        } else if(existingUser && !existingUser.isActive){this.bot.sendMessage(
          chatId,
          `You have un-subscribed! 
- /subscribe: to start receiving updates again.`,
        );
        }
          else {
          this.bot.sendMessage(chatId, 'Please enter your name:');
          this.bot.once('message', async (nameMsg) => {
            const name = nameMsg.text;

            this.bot.sendMessage(chatId, 'Please enter your city:');
            this.bot.once('message', async (cityMsg) => {
              const city = cityMsg.text;
              const apiKey = '82982b4ebdb12956cef20044e6d4fdef';
              const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

              try {
                const response = await axios.get(url);
                if (response.data && response.data.weather) {
                  const newUser = new this.userModel({
                    chatId,
                    username: name,
                    city,
                    isBlocked: false,
                    isActive: true,
                  });
                  await newUser.save();
                  this.bot.sendMessage(
                    chatId,
                    `Welcome, ${name} from ${city}! You’re all set to receive daily weather updates every morning at 9:00 AM.
- /get_live_weather_update: Receive the latest weather update.
- /change_city: Update your city preferences.
- /unsubscribe: Stop receiving updates.`,
                  );
                }
              } catch (error) {
                this.bot.sendMessage(
                  chatId,
                  'Invalid city name. Please enter a valid city:',
                );
                this.bot.once('message', async (newCityMsg) => {
                  const newCity = newCityMsg.text;
                  const newUrl = `http://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}`;

                  try {
                    const newResponse = await axios.get(newUrl);
                    if (newResponse.data && newResponse.data.weather) {
                      const newUser = new this.userModel({
                        chatId,
                        username: name,
                        city: newCity,
                      });
                      await newUser.save();
                      this.bot.sendMessage(
                        chatId,
                        `Welcome, ${name} from ${newCity}! You are now subscribed.`,
                      );
                    }
                  } catch (newError) {
                    this.bot.sendMessage(
                      chatId,
                      'Failed to subscribe. Please try again.',
                    );
                  }
                });
              }
            });
          });
        }
      } catch (e) {
        console.log(e);
        this.bot.sendMessage(
          chatId,
          'An error occurred. Please try again later.',
        );
      }
    });
    this.bot.onText(/\/subscribe/, async (msg) => {
      const chatId = msg.chat.id;
      const existingUser = await this.userModel.findOne({ chatId });
      if(existingUser){
        existingUser.isActive = true;
        await existingUser.save()
        this.bot.sendMessage(chatId, `You have subscribed again for daily weather updates !`);
      }
    })
    this.bot.onText(/\/get_live_weather_update/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        const existingUser = await this.userModel.findOne({ chatId });

        const weather = await this.getWeather(chatId);
        this.bot.sendMessage(chatId, `The weather currently in ${existingUser.city} is ${weather}`);
      } catch (e) {
        this.bot.sendMessage(chatId, `Failed to get weather`);
      }
    });

    this.bot.onText(/\/change_city/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        const existingUser = await this.userModel.findOne({ chatId });

        if (!existingUser) {
          this.bot.sendMessage(
            chatId,
            'You need to subscribe first! Use /start to subscribe.',
          );
          return;
        }
        this.bot.sendMessage(chatId, 'Please enter your new city:');
        this.bot.once('message', async (cityMsg) => {
          const newCity = cityMsg.text;
          const apiKey = '82982b4ebdb12956cef20044e6d4fdef';
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}`;

          try {
            const response = await axios.get(url);

            if (response.data && response.data.weather) {
              existingUser.city = newCity;
              await existingUser.save();
              this.bot.sendMessage(
                chatId,
                `Your city has been updated to ${newCity}.`,
              );
            } else {
              this.bot.sendMessage(
                chatId,
                'Could not find that city. Please enter a valid city name.',
              );
            }
          } catch (error) {
            this.bot.sendMessage(
              chatId,
              'Could not find that city. Please enter a valid city name.',
            );
          }
        });
      } catch (e) {
        console.log(e);
        this.bot.sendMessage(
          chatId,
          'An error occurred while processing your request.',
        );
      }
    });
    this.bot.onText(/\/unsubscribe/, async (msg) => {
      const chatId = msg.chat.id;

      try {
        const existingUser = await this.userModel.findOne({ chatId });

        if (!existingUser) {
          this.bot.sendMessage(chatId, 'You are not currently subscribed.');
          return;
        }
        if (existingUser.isBlocked) {
          this.bot.sendMessage(chatId, 'You are Blocked.');
          return;
        }
        existingUser.isActive = false;
        await existingUser.save();

        this.bot.sendMessage(
          chatId,
          'You have been unsubscribed successfully. You will no longer receive updates.',
        );
      } catch (e) {
        console.log(e);
        this.bot.sendMessage(
          chatId,
          'An error occurred while processing your request. Please try again later.',
        );
      }
    });

    this.bot.onText(/\/weather (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const city = 'london';
      const apiKey = '82982b4ebdb12956cef20044e6d4fdef';
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

      try {
        const response = await axios.get(url);
        const weather = response.data.weather[0].description;
        this.bot.sendMessage(chatId, `The weather in ${city} is ${weather}`);
      } catch (error) {
        this.bot.sendMessage(chatId, `Could not retrieve weather for ${city}`);
      }
    });
    this.bot.on('message', async(msg) => {
      const chatId = msg.chat.id;
      if(msg.text &&! msg.text.startsWith('/')){
      const existingUser = await this.userModel.findOne({ chatId });
      if(existingUser){
        this.bot.sendMessage(chatId, `Hey There !
        - /get_live_weather_update: Receive the latest weather update.
        - /change_city: Update your city preferences.
        - /unsubscribe: Stop receiving updates.`)
      }else{
      this.bot.sendMessage(chatId, 'Welcome! Please use /start to get started.');
      }
    }
    });
  
  }

  sendMessage(chatId: number, message: string) {
    this.bot.sendMessage(chatId, message);
  }
  private async getWeather(chatId: number) {
    const user = await this.userModel.findOne({ chatId });

    if (!user || !user.city) {
      return `City not found for this user. Please subscribe first and provide a city.`;
    }

    const city = user.city;
    const apiKey = this.apiKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const weatherData = response.data;
    const description = weatherData.weather[0].description;
    const temp = weatherData.main.temp;

    return `${description}`;
  }
  @Cron('0 9 * * *')
  async sendDailyWeatherUpdates() {
    try {
      const users = await this.userModel.find();
      for (const user of users) {
        if (user.city && user.isActive && !user.isBlocked) {
          const weatherInfo = await this.getWeather(user.chatId);
          this.bot.sendMessage(
            user.chatId,
            `Good morning ${user.username}! Here is your daily weather update for ${user.city} : \n${weatherInfo}`,
          );
        }
      }
    } catch (error) {
      console.error('Failed to send daily weather updates:', error);
    }
  }
}
