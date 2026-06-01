import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { adminSeed } from './admin-seed';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await adminSeed(app.get(PrismaService));
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
