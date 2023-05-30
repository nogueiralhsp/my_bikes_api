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

    async updateToken(user: User, _id): Promise<any>{
        // console.log('User => '+_id);
        await this.userModel.findByIdAndUpdate(_id, {token:[user.token]})
    }

    async logIn(username: string, pass: string): Promise<User | any> {

        const user = (await this.userModel.findOne({ username }))

        if (!await bcrypt.compare(pass, user.password)) {
            throw new UnauthorizedException()
        }

        user.password = undefined

        const payload = { sub: user._id, username: user.username };
        const newToken = await this.jwtService.signAsync(payload)

        user.token = [newToken]
        this.updateToken(user,user.id)
        
        return user;
    }
}