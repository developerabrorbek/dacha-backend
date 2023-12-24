import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, jwtConfig, minioConfigs } from '@config';
import {
  AuthModule,
  ComfortModule,
  CottageModule,
  CottageTypeModule,
  LanguageModule,
  ModelsModule,
  NotificationModule,
  PermissionModule,
  PlaceModule,
  RegionModule,
  RoleModule,
  TranslateModule,
  UserModule,
} from '@modules';
import { PrismaModule } from '@prisma';
import { MinioModule } from '@client';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard, PermissionGuard } from '@guard';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, minioConfigs, jwtConfig],
    }),
    JwtModule,
    MinioModule,
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
