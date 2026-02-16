import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppConfig } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse cookies so @Req().cookies works
  app.use(cookieParser());

  // Enable CORS for frontend origin (credentials mode requires explicit origin)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  const port = appConfig?.port || 3000;
  await app.listen(port);

  console.log(`Application running on port ${port}`);
}
bootstrap();
