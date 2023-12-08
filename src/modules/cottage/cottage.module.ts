import { Module } from '@nestjs/common';
import { CottageController } from './cottage.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CottageService } from './cottage.service';
import { MinioService } from 'client';

@Module({
  controllers: [CottageController],
  providers: [PrismaService, MinioService, CottageService],
})
export class CottageModule {}
