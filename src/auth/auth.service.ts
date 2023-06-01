import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private userservice: UsersService,
        private jwtService: JwtService
    ) { }

    async updateToken(id, token): Promise<any> {
        let newTokenArray = []
        newTokenArray = await (await this.userModel.findById(id)).token
        newTokenArray.push(token)
        this.userModel.findOneAndUpdate(id,newTokenArray)

        console.log(newTokenArray);
        

    }

    async logIn(username: string, pass: string): Promise<User | any> {

        const user = (await this.userModel.findOne({ username }))

        if (!await bcrypt.compare(pass, user.password)) {
            throw new UnauthorizedException()
        }
        //clearing password for security
        user.password = undefined

        //generating token
        const payload = { sub: user._id, username: user.username };
        const newToken = await this.jwtService.signAsync(payload)


        user.token.push(newToken)
        this.updateToken(user.id, newToken)

        return user;
    }
}