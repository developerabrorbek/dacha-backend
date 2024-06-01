import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TranslateService } from '@modules';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateTariffRequest,
  DisableTariffRequest,
  UpdateTariffRequest,
  UseTariffRequest,
} from './interfaces';
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
      this.#_checkUUID(payload.description);
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

  async activateTariff(payload: UseTariffRequest): Promise<void> {
    // Checking User UUID
    this.#_checkUUID(payload.assignedBy);

    // Checking Cottage UUID
    this.#_checkUUID(payload.cottageId);

    // Checking Tariff UUID
    this.#_checkUUID(payload.tariffId);

    const foundedTariff = await this.#_prisma.tariff.findFirst({
      where: { id: payload.tariffId },
      include: { service: true },
    });

    if (!foundedTariff) throw new NotFoundException('Tariff not found');

    const foundedCottage = await this.#_prisma.cottage.findFirst({
      where: { id: payload.cottageId },
    });

    if (!foundedCottage) throw new NotFoundException('Cottage not found');

    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: payload.assignedBy },
    });

    if (!foundedUser) throw new NotFoundException('User not found');

    await this.#_prisma.cottageOnTariff.create({
      data: {
        assignedBy: payload.assignedBy,
        tariffId: foundedTariff.id,
        cottageId: foundedCottage.id,
        end_time: String(
          new Date().setDate(new Date().getDate() + foundedTariff.days),
        ),
      },
    });
  }

  async disableTariff(payload: DisableTariffRequest): Promise<void> {
    // Checking Cottage UUID
    this.#_checkUUID(payload.cottageId);

    // Checking Tariff UUID
    this.#_checkUUID(payload.tariffId);

    const foundedTariff = await this.#_prisma.tariff.findFirst({
      where: { id: payload.tariffId },
      include: { service: true },
    });

    if (!foundedTariff) throw new NotFoundException('Tariff not found');

    const foundedCottage = await this.#_prisma.cottage.findFirst({
      where: { id: payload.cottageId },
    });

    if (!foundedCottage) throw new NotFoundException('Cottage not found');

    const foundedCottageOnTariff =
      await this.#_prisma.cottageOnTariff.findFirst({
        where: {
          cottageId: payload.cottageId,
          tariffId: payload.tariffId,
        },
      });

    await this.#_prisma.cottageOnTariff.update({
      where: {
        cottageId_tariffId: {
          cottageId: payload.cottageId,
          tariffId: payload.tariffId,
        },
      },
      data: {
        status: payload?.status
          ? payload.status
          : foundedCottageOnTariff.status,
        tariffStatus: payload?.tariffStatus
          ? payload.tariffStatus
          : foundedCottageOnTariff.tariffStatus,
      },
    });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4))
      throw new ConflictException('Please provide a valid UUID');
  }
}
