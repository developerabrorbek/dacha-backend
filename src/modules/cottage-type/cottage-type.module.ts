import { Module } from '@nestjs/common';
import { CottageTypeController } from './cottage-type.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CottageTypeService } from './cottage-type.service';
import { TranslateService } from 'modules/translate';

@Module({
  controllers: [CottageTypeController],
  providers: [PrismaService, TranslateService,CottageTypeService],
})
export class CottageTypeModule {}
