import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, jwtConfig } from '@config';
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
} from '@modules';
import { PrismaModule } from '@prisma';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard, PermissionGuard } from '@guard';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@filters';
import {ServeStaticModule } from "@nestjs/serve-static"
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: "/uploads/",
      rootPath: join(__dirname, "..", "uploads"),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig,databaseConfig, jwtConfig],
    }),
    JwtModule,
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
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
