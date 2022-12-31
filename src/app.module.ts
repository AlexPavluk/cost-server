import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { MongooseConfigServise } from './config/MongooseConfigServise';
import { CostsModule } from './costs/costs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigServise,
    }),
    ConfigModule.forRoot({
      load: [config],
    }),
    UsersModule,
    AuthModule,
    CostsModule,
  ],
})
export class AppModule {}
