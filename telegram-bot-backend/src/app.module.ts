import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotService } from './bot/bot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './schemas/config.model';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://kesav:rollno1212@cluster0.cedis9y.mongodb.net/weather?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ScheduleModule.forRoot(),
    ConfigModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, BotService],
})
export class AppModule {}
