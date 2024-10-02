import { json } from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
    logger: false,
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
  if(process.env.NODE_ENV == 'development') {
    app.use(morgan("tiny"))
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

  // GET CONFIG SERVICE FOR APP CONFIGURATION
  const configService = app.get(ConfigService)

  // listening server
  await app.listen(configService.get<number>("app.port"), () => {
    console.log(`listening on port: ${configService.get<number>("app.port")} and environment: ${process.env.NODE_ENV} ` )
  });
}
bootstrap();
