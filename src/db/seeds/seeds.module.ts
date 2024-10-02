import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';

@Module({
  providers: [PrismaService, SeedsService],
  controllers: [SeedsController],
})
export class SeedsModule {}
