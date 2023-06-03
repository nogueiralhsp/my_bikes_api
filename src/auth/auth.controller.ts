import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    logIn(@Body() signInDto: Record<string, any>) {
    
        return this.authService.logIn(signInDto.username, signInDto.password)
    }
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Body() signOutDto: Record<string, any>) {
        try {
            const result = await this.authService.logOut(signOutDto)

            return result

        } catch (e) {
            console.log(e);

            return e
        }

    }

    @HttpCode(HttpStatus.OK)
    @Post('logoutall')
    async logoutall(@Body() signOutDto: Record<string, any>) {
        try {
            const result = await this.authService.logOutAll(signOutDto)

            return result

        } catch (e) {
            console.log(e);

            return e
        }

    }
}