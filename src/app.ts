import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, jwtConfig, paymeConfig, smsConfig } from '@config';
import {
  AuthModule,
  ComfortModule,
  CottageModule,
  CottageTypeModule,
  LanguageModule,
  ModelsModule,
  NotificationModule,
  OrderModule,
  PermissionModule,
  PlaceModule,
  RegionModule,
  RoleModule,
  ServicesModule,
  TariffModule,
  TranslateModule,
  UserModule,
  PaymeModule
} from '@modules';
import { PrismaModule } from '@prisma';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard, PermissionGuard } from '@guard';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter, PrismaClientExceptionFilter } from '@filters';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SeedsModule } from 'db';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, paymeConfig, smsConfig],
    }),
    JwtModule.register({
      global: true
    }),
    PrismaModule,
    LanguageModule,
    TranslateModule,
    RegionModule,
    PlaceModule,
    ComfortModule,
    CottageModule,
    NotificationModule,
    CottageTypeModule,
    ModelsModule,
    PermissionModule,
    RoleModule,
    AuthModule,
    UserModule,
    ServicesModule,
    TariffModule,
    OrderModule,
    PaymeModule,
    SeedsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
