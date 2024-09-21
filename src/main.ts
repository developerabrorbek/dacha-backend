import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
    // logger: false,
  });

  // SET VERSION PREFIX FOR SERVER
  app.setGlobalPrefix('/api/v1');

  // SET JSON data LIMIT
  app.use(json({ limit: '125mb' }));
  app.disable('x-powered-by', 'X-Powered-By', 'etag');

  // ENABLING CORS
  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: '*',
  });

  // MORGAN middleware
  if (process.env.NODE_ENV == 'development') {
    app.use(morgan('tiny'));
  }

  // ADDING VALIDATION PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // ADD SWAGGER DOCUMENTATION CONFIGS
  const config = new DocumentBuilder()
    .setTitle('Dacha API Documentation')
    .setDescription('The dacha site API description')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'JWT')
    .build();

  // SETTING UP SWAGGER API
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // get config service for getting appConfig
  const configService = app.get(ConfigService);

  // listening server
  await app.listen(configService.get<number>('appConfig.port'), () => {
    console.log(
      `listening on port: ${configService.get<number>('appConfig.port')} and environment: ${process.env.NODE_ENV} `,
    );
  });
}
bootstrap();
