import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, minioConfigs } from 'config';
import {
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
} from 'modules';
import { PrismaModule } from '@prisma';
import { MinioModule } from 'client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, minioConfigs],
    }),
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
  ],
})
export class AppModule {}
