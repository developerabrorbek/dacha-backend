import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateCottageTypeRequest,
  UpdateCottageTypeRequest,
} from './interfaces';
import { CottageType } from '@prisma/client';
import { TranslateService } from 'modules/translate';
import { isUUID } from 'class-validator';

@Injectable()
export class CottageTypeService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createCottageType(payload: CreateCottageTypeRequest): Promise<void> {
    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });
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
    this.#_checkUUID(payload.id)
    const foundedCottageType = await this.#_prisma.cottageType.findFirst({
      where: { id: payload.id },
    });
    await this.#_translate.updateTranslate({
      id: foundedCottageType.name,
      status: 'inactive',
    });
    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });

    await this.#_prisma.cottageType.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteCottageType(id: string): Promise<void> {
    this.#_checkUUID(id)
    const foundedCottageType = await this.#_prisma.cottageType.findFirst({
      where: { id: id },
    });
    await this.#_translate.updateTranslate({
      id: foundedCottageType.name,
      status: 'inactive',
    });
    await this.#_prisma.cottageType.delete({ where: { id } });
  }

  #_checkUUID(id: string): void{
    if(!isUUID(id, 4)){
      throw new ConflictException("Please provide a valid UUID")
    }
  }
}
