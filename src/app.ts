import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, minioConfigs } from 'config';
import { ComfortModule, CottageModule, LanguageModule, PlaceModule, RegionModule, TranslateModule } from 'modules';
import { PrismaModule } from '@prisma';
import { MinioModule } from 'client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, minioConfigs]
    }),
    MinioModule,
    PrismaModule,
    LanguageModule,
    TranslateModule,
    RegionModule,
    PlaceModule,
    ComfortModule,
    CottageModule,
  ],
})
export class AppModule {}
