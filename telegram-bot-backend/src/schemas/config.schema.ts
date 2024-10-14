import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema()
export class Config {
  @Prop({ required: true })
  telegramToken: string;

  @Prop({ required: true })
  weatherApiKey: string;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
