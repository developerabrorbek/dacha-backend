import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app';
import { appConfig } from 'config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  app.use(cookieParser("salom"))

  app.use(json({ limit: '125mb' }));
  app.disable('x-powered-by', 'X-Powered-By', 'etag');

  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));


  const config = new DocumentBuilder()
    .setTitle('Dacha API Documentation')
    .setDescription('The dacha site API description')
    .setVersion('1.0')
    .addBearerAuth(undefined, "JWT")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(appConfig.port);
}
bootstrap();
