import { Module } from '@nestjs/common';
import { ComfortController } from './comfort.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ComfortService } from './comfort.service';
import { TranslateService } from 'modules/translate';

@Module({
  controllers: [ComfortController],
  providers: [PrismaService, TranslateService, ComfortService],
})
export class ComfortModule {}
