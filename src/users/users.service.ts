/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { User, UsersDocument } from '../schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.usersModel.collection.findOne({
        username: loginUserDto.username,
    });

    if(!user) {
      return null
    }

    return user as User;
  }

  async registacion(createUserDto: CreateUserDto): Promise<User | null> {
    const existigUser = await this.usersModel.collection.findOne({
        username: createUserDto.username,
    });

    if(existigUser) {
        return null;
    }

    const createdUser = new this.usersModel(createUserDto);
    return createdUser.save();
  }

  async findOne(username: string): Promise<User> {
    return this.usersModel.findOne({ username });
  }
}
