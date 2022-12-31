import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: ['http://localhost:3000/'],
    allowedHeaders: ['content-type'],
    credentials: true,
  });

  await app.listen(4200);
}
bootstrap();
