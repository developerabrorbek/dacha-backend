import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateServiceRequest, UpdateServiceRequest } from './interfaces';
import { TranslateService } from 'modules/translate';
import { Service } from '@prisma/client';
import { join } from 'path';
import * as fs from 'fs';
import { isUUID } from 'class-validator';

@Injectable()
export class ServicesService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createService(payload: CreateServiceRequest): Promise<void> {
    if (!payload.images) {
      throw new ConflictException('Please provide service images');
    }

    const images = [];

    if (payload.images.length) {
      for (const e of payload.images) {
        const imagePath = e.path.replace('\\', '/');

        images.push(imagePath.replace('\\', '/'));
      }
    }

    // Translate for "name" is updated to "active"
    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });

    // Translate for "description" is updated to "active"
    await this.#_translate.updateTranslate({
      id: payload.description,
      status: 'active',
    });

    await this.#_prisma.service.create({
      data: {
        description: payload.description,
        name: payload.name,
        images: { set: images },
        serviceCode: payload.code,
      },
    });
  }

  async getAllService(languageCode: string): Promise<Service[]> {
    const data = await this.#_prisma.service.findMany({include: {tariffs: true}});

    for (const el of data) {
      const name = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.name,
      });
      el.name = name.value;

      const description = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.description,
      });
      el.description = description.value;

      for(const tr of el.tariffs){
        const description = await this.#_translate.getSingleTranslate({
          languageCode,
          translateId: tr.description,
        });
        tr.description = description.value;

        const type = await this.#_translate.getSingleTranslate({
          languageCode,
          translateId: tr.type,
        });
        tr.type = type.value;
      }
    }

    return data;
  }

  async updateService(payload: UpdateServiceRequest): Promise<void> {
    // Checking UUID
    this.#_checkUUID(payload.id);

    const foundedService = await this.#_prisma.service.findFirst({
      where: { id: payload.id },
    });

    if (!foundedService) throw new NotFoundException('Service not found');

    if (payload?.name) {
      await this.#_translate.updateTranslate({
        id: payload.name,
        status: 'active',
      });

      await this.#_translate.updateTranslate({
        id: foundedService.name,
        status: 'inactive',
      });

      await this.#_prisma.service.update({
        where: { id: payload.id },
        data: { name: payload.name },
      });
    }

    if (payload?.description) {
      await this.#_translate.updateTranslate({
        id: payload.description,
        status: 'active',
      });

      await this.#_translate.updateTranslate({
        id: foundedService.description,
        status: 'inactive',
      });

      await this.#_prisma.service.update({
        where: { id: payload.id },
        data: { description: payload.description },
      });
    }

    const images = [];

    if (payload?.images?.length) {
      for (const e of payload.images) {
        const imagePath = e.path.replace('\\', '/');

        images.push(imagePath.replace('\\', '/'));
      }

      // Deleting old images of service
      for (const img of foundedService.images) {
        fs.unlink(join(process.cwd(), img), (): unknown => undefined);
      }
    }
  }

  async deleteService(id: string): Promise<void> {
    // Checking UUID
    this.#_checkUUID(id);

    const foundedService = await this.#_prisma.service.findFirst({
      where: { id },
    });

    if (!foundedService) return;

    // Set Inactive to old translate
    await this.#_translate.updateTranslate({
      id: foundedService.description,
      status: 'inactive',
    });

    // Set Inactive to old translate
    await this.#_translate.updateTranslate({
      id: foundedService.name,
      status: 'inactive',
    });

    for (const image of foundedService.images) {
      fs.unlink(join(process.cwd(), image), (): unknown => undefined);
    }

    await this.#_prisma.service.delete({ where: { id } });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4))
      throw new ConflictException('Please provide a valid UUID');
  }
}
