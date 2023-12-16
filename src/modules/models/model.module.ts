import { Module } from '@nestjs/common';
import { ModelsController } from './model.controller';
import { PrismaService } from 'prisma/prisma.service';
import { Modelservice } from './model.service';

@Module({
  controllers: [ModelsController],
  providers: [PrismaService, ,Modelservice],
})
export class ModelsModule {}
