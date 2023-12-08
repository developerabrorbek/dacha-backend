import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PlaceService } from './place.service';
import { MinioService } from 'client';

@Module({
  controllers: [PlaceController],
  providers: [PrismaService, MinioService ,PlaceService],
})
export class PlaceModule {}
