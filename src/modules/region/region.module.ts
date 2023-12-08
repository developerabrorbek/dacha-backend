import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { PrismaService } from 'prisma/prisma.service';
import { RegionService } from './region.service';
import { TranslateService } from 'modules/translate';

@Module({
  controllers: [RegionController],
  providers: [PrismaService, TranslateService,RegionService],
})
export class RegionModule {}
