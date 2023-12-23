import { Module } from '@nestjs/common';
import { CottageController } from './cottage.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CottageService } from './cottage.service';
import { MinioService } from 'client';
import { TranslateService } from 'modules/translate';

@Module({
  controllers: [CottageController],
  providers: [PrismaService, TranslateService, MinioService, CottageService],
})
export class CottageModule {}
