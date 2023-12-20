import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PlaceService } from './place.service';
import { MinioService } from 'client';
import { TranslateService } from 'modules/translate';

@Module({
  controllers: [PlaceController],
  providers: [PrismaService, TranslateService, MinioService ,PlaceService],
})
export class PlaceModule {}
