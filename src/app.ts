import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from 'config';
import { LanguageModule, TranslateModule } from 'modules';
import { PrismaModule } from '@prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig]
    }),
    PrismaModule,
    LanguageModule,
    TranslateModule,
  ],
})
export class AppModule {}
