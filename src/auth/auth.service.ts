import { Model, ObjectId } from 'mongoose';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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

        //pushing new token into the array
        user.token.push(newToken)

        await this.userModel.findByIdAndUpdate(user.id, { token: user.token }, { new: true })

        return { token: newToken };
    }


    async logOut(data): Promise<any> {
        // Expected data format
        // data = {
        //     _id: 'string',
        //     token: 'string'
        // }

        if ((await this.userModel.updateOne({ _id: data._id }, { $pull: { token: data.token } }, { new: true })).modifiedCount === 1) {

            return {
                status: HttpStatus.OK,
                message: 'logged out successfully'
            }
        } else {

            return {
                status: HttpStatus.UNAUTHORIZED,
                message: 'loggin out opperation error, unauthenticated'
            }
        }

        // console.log(user);

    }

    async logOutAll(data: object): Promise<any> {

        if ((await this.userModel.findByIdAndUpdate(data, { token: [] }, { new: true })).token.length == 0) {

            return {
                status: HttpStatus.OK,
                message: 'logged out from all connected devices successfully'
            }
        } else {

            return {
                status: HttpStatus.UNAUTHORIZED,
                message: 'loggin out opperation error, unauthenticated'
            }
        }

    }
}