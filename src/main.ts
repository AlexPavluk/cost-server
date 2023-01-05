import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://costs-client-omega.vercel.app/',
    allowedHeaders: ['content-type'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 4200);
}
bootstrap();
