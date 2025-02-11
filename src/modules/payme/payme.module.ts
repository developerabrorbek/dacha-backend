import { Module } from '@nestjs/common';
import { PaymeService } from './payme.service';
import { PaymeController } from './payme.controller';
import { PrismaService } from '@prisma';

@Module({
  controllers: [PaymeController],
  providers: [PaymeService, PrismaService],
})
export class PaymeModule {}
