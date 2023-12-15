import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRegionRequest, UpdateRegionRequest } from './interfaces';
import { Region } from '@prisma/client';
import { TranslateService } from 'modules/translate';

@Injectable()
export class RegionService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createRegion(payload: CreateRegionRequest): Promise<void> {
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
    await this.#_prisma.region.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteRegion(id: string): Promise<void> {
    await this.#_prisma.region.delete({ where: { id } });
  }
}
