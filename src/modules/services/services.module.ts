import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { PrismaService } from 'prisma/prisma.service';
import { TranslateService } from '@modules';
import { ServicesService } from './services.service';

@Module({
  controllers: [ServicesController],
  providers: [PrismaService, TranslateService, ServicesService],
})
export class ServicesModule {}
