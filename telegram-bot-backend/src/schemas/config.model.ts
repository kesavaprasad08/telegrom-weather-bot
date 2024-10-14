import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from '../schemas/config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
})
export class ConfigModule {}
