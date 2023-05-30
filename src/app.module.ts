import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }