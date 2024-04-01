import { Module } from '@nestjs/common';
import { TariffController } from './tariff.controller';
import { TariffService } from './tariff.service';
import { PrismaService } from 'prisma/prisma.service';
import { TranslateService } from '@modules';

@Module({
  controllers: [TariffController],
  providers: [PrismaService, TranslateService, TariffService],
})
export class TariffModule {}
