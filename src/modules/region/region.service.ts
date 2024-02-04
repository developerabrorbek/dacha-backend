import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRegionRequest, UpdateRegionRequest } from './interfaces';
import { Region } from '@prisma/client';
import { TranslateService } from 'modules/translate';
import { isUUID } from 'class-validator';

@Injectable()
export class RegionService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createRegion(payload: CreateRegionRequest): Promise<void> {
    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });
    await this.#_prisma.region.create({ data: { name: payload.name } });
  }

  async getRegionList(languageCode: string): Promise<Region[]> {
    const data = await this.#_prisma.region.findMany();
    for (const el of data) {
      const res = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.name,
      });
      el.name = res.value;
    }
    return data;
  }

  async updateRegion(payload: UpdateRegionRequest): Promise<void> {
    this.#_checkUUID(payload.id)
    const foundedRegion = await this.#_prisma.region.findFirst({
      where: { id: payload.id },
    });

    if (!foundedRegion) {
      throw new NotFoundException('Region not found');
    }

    await this.#_translate.updateTranslate({
      id: foundedRegion.name,
      status: 'inactive',
    });

    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });

    await this.#_prisma.region.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteRegion(id: string): Promise<void> {
    this.#_checkUUID(id)
    const foundedRegion = await this.#_prisma.region.findFirst({
      where: { id },
    });
    if (!foundedRegion) {
      throw new NotFoundException('Region not found');
    }
    await this.#_translate.updateTranslate({
      id: foundedRegion.name,
      status: 'inactive',
    });
    await this.#_prisma.region.delete({ where: { id: foundedRegion.id } });
  }

  #_checkUUID(id: string): void{
    if(!isUUID(id, 4)){
      throw new ConflictException("Please provide a valid UUID")
    }
  }
}
