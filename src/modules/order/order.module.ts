import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TranslateService } from 'modules/translate';
import { OrderController } from './order.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [OrderService, TranslateService, PrismaService],
  controllers: [OrderController],
})
export class OrderModule {}
