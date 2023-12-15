import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateCottageTypeRequest,
  UpdateCottageTypeRequest,
} from './interfaces';
import { CottageType } from '@prisma/client';
import { TranslateService } from 'modules/translate';

@Injectable()
export class CottageTypeService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createCottageType(payload: CreateCottageTypeRequest): Promise<void> {
    await this.#_prisma.cottageType.create({ data: { name: payload.name } });
  }

  async getCottageTypeList(languageCode: string): Promise<CottageType[]> {
    const data = await this.#_prisma.cottageType.findMany();
    for (const el of data) {
      const res = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.name,
      });
      el.name = res.value;
    }
    return data;
  }

  async updateCottageType(payload: UpdateCottageTypeRequest): Promise<void> {
    await this.#_prisma.cottageType.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteCottageType(id: string): Promise<void> {
    await this.#_prisma.cottageType.delete({ where: { id } });
  }
}
