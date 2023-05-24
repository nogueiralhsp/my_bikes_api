import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private userservice: UsersService) { }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.userservice.findOne(username)
        
        if (user?.password !== pass) {            
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;

        // TODO: Generate a JWT and return it here
        // instead of the user object

        // WARNING
        // Of course in a real application, you wouldn't store a password in plain text. You'd instead use a library like bcrypt,
        // with a salted one-way hash algorithm. With that approach, you'd only store hashed passwords, and then compare the stored 
        // password to a hashed version of the incoming password, thus never storing or exposing user passwords in plain text. To keep 
        // our sample app simple, we violate that absolute mandate and use plain text. Don't do this in your real app!
        return result;
    }
}
