import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  // ***********************************************************
  private readonly userTest = [
    {
      userId: 1,
      name: 'john',
      username: 'john',
      password: 'changeme',
      email:'john@email.com'
    },
    {
      userId: 2,
      name:'maria',
      username: 'maria',
      password: 'guess',
      email:'maria@gmail.com'
    },
  ];
  // ***********************************************************

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUSer = new this.userModel(createUserDto);
      createdUSer.save()
      return createdUSer;
    } catch (e) {
      return e
    }

  }

  findAll() {
    return `This action returns all users`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  async findOne(username: string): Promise<User | undefined> {
    return this.userTest.find(user => user.username === username)
  }
  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
