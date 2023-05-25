import { Model } from 'mongoose'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<any> {
    
    try {
      const { username, email } = createUserDto;
      const check = await this.userCheck(username, email);

      if (!check) {
        const createdUser = new this.userModel(createUserDto);

        createdUser.password = await bcrypt.hash(createdUser.password, +process.env.SALTED);
        createdUser.save();

        createdUser.password = undefined
        return createdUser
      }else{

        return check

      }
    } catch (e) {
      return e
    }
  }

  async userCheck(username: string, email: string): Promise<any> {
    try {
      //checking if username already exist
      if (await this.userModel.findOne({ username })) {  
        return new UnauthorizedException('User already Exists')
      }
      //checking if email already in use
      if (await this.userModel.findOne({ email })) {
        return new UnauthorizedException('One account already exists with this email')
      }
      return false

    } catch (e) {

      return e
    }

  }


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
