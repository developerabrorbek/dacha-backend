import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { PrismaService } from 'prisma/prisma.service';
import { RegionService } from './region.service';

@Module({
  controllers: [RegionController],
  providers: [PrismaService, RegionService],
})
export class RegionModule {}
