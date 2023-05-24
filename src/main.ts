import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  await app.listen(process.env.PORT);
}
bootstrap();
