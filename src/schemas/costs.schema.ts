import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CostsDocument = Cost & Document;

@Schema()
export class Cost {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: new Date() })
  data: Date;

  @Prop({ required: true, default: '1' })
  userId: string;
}

export const CostsSchema = SchemaFactory.createForClass(Cost);
