import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TranslateService } from '@modules';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTariffRequest, UpdateTariffRequest } from './interfaces';
import { Tariff } from '@prisma/client';
import { isUUID } from 'class-validator';

@Injectable()
export class TariffService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createTariff(payload: CreateTariffRequest): Promise<void> {
    // Update "description" translate status to active
    await this.#_translate.updateTranslate({
      id: payload.description,
      status: 'active',
    });

    // Update "type" translate status to active
    await this.#_translate.updateTranslate({
      id: payload.type,
      status: 'active',
    });

    await this.#_prisma.tariff.create({
      data: {
        days: payload.days,
        description: payload.description,
        price: payload.price,
        type: payload.type,
        service_id: payload.service_id,
      },
    });
  }

  async getAllTariffs(languageCode: string): Promise<Tariff[]> {
    const data = await this.#_prisma.tariff.findMany({
      include: {
        service: { select: { name: true, id: true, serviceCode: true } },
        cottages: { select: { cottage: true } },
      },
    });

    for (const el of data) {
      const description = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.description,
      });
      el.description = description.value;

      const type = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.type,
      });
      el.type = type.value;

      const service = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.service.name,
      });
      el.service.name = service.value;
    }

    return data;
  }

  async updateTariff(payload: UpdateTariffRequest): Promise<void> {
    // Checking ID
    this.#_checkUUID(payload.id);

    const foundedTariff = await this.#_prisma.tariff.findFirst({
      where: { id: payload.id },
    });

    if (!foundedTariff) {
      throw new NotFoundException('Tariff not found');
    }

    if (payload?.description) {
      await this.#_translate.updateTranslate({
        id: foundedTariff.description,
        status: 'inactive',
      });

      await this.#_translate.updateTranslate({
        id: payload.description,
        status: 'active',
      });

      await this.#_prisma.tariff.update({
        where: { id: payload.id },
        data: { description: payload.description },
      });
    }

    await this.#_prisma.tariff.update({
      where: { id: payload.id },
      data: {
        days: payload.days || foundedTariff.days,
        price: payload.price || foundedTariff.price,
      },
    });
  }

  async deleteTariff(id: string): Promise<void> {
    // Checking ID
    this.#_checkUUID(id);

    const foundedTariff = await this.#_prisma.tariff.findFirst({
      where: { id: id },
    });

    if (!foundedTariff) {
      return;
    }

    // Inactivate "description" translate
    await this.#_translate.updateTranslate({
      id: foundedTariff.description,
      status: 'inactive',
    });

    // Inactivate "type" translate
    await this.#_translate.updateTranslate({
      id: foundedTariff.type,
      status: 'inactive',
    });

    await this.#_prisma.tariff.delete({ where: { id } });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4))
      throw new ConflictException('Please provide a valid UUID');
  }
}
