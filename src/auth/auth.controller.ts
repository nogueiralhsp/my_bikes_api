import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    logIn(@Body() signInDto: Record<string, any>){
        return this.authService.logIn(signInDto.username,signInDto.password)
    }
}