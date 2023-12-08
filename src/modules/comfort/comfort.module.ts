import { Module } from '@nestjs/common';
import { ComfortController } from './comfort.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ComfortService } from './comfort.service';
import { MinioService } from 'client';

@Module({
  controllers: [ComfortController],
  providers: [PrismaService, MinioService, ComfortService],
})
export class ComfortModule {}
