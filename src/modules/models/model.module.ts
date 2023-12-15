import { Module } from '@nestjs/common';
import { RegionController } from './model.controller';
import { PrismaService } from 'prisma/prisma.service';
import { RegionService } from './model.service';
import { TranslateService } from 'modules/translate';

@Module({
  controllers: [RegionController],
  providers: [PrismaService, TranslateService,RegionService],
})
export class RegionModule {}
