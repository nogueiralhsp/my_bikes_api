import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private userservice: UsersService
    ) { }


    async logIn(username: string, pass: string): Promise<User | any> {

        const user = (await this.userModel.findOne({ username }))

        if (!await bcrypt.compare(pass, user.password)) {
            throw new UnauthorizedException()
        }
        user.password = undefined
        return user;
    }

}