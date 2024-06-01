import { PrismaService } from '@prisma';
import {
  CreateLanguageRequest,
  UpdateLanguageImageRequest,
  UpdateLanguageRequest,
} from './interfaces';
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Language } from '@prisma/client';
import { isUUID } from 'class-validator';
import { join } from 'path';
import * as fs from 'fs';


@Injectable()
export class LanguageService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createLanguage(payload: CreateLanguageRequest): Promise<void> {
    await this.#_checkExistingLanguage(payload.code);

    const imagePath = payload?.image?.path
      ? payload?.image?.path.replace('\\', '/')
      : '';

    await this.#_prisma.language.create({
      data: {
        code: payload.code,
        title: payload.title,
        image: imagePath.replace('\\', '/'),
      },
    });
  }

  async getLanguageList(): Promise<Language[]> {
    return await this.#_prisma.language.findMany();
  }

  async updateLanguage(payload: UpdateLanguageRequest): Promise<void> {
    await this.#_checkLanguage(payload.id);

    await this.#_prisma.language.update({
      data: { title: payload.title },
      where: { id: payload.id },
    });
  }

  async updateLanguageImage(
    payload: UpdateLanguageImageRequest,
  ): Promise<void> {
    await this.#_checkLanguage(payload.languageId);

    const foundedLanguage = await this.#_prisma.language.findFirst({where: {id: payload.languageId}})

    if(foundedLanguage.image){
      fs.unlink(
        join(process.cwd(), foundedLanguage.image),
        (): unknown => undefined,
      );
    }

    const imagePath = payload.image.path.replace('\\', '/');

    await this.#_prisma.language.update({
      where: { id: payload.languageId },
      data: {
        image: imagePath.replace('\\', '/'),
      },
    });
  }

  async deleteLanguage(id: string): Promise<void> {
    await this.#_checkLanguage(id);

    await this.#_prisma.language.delete({ where: { id } });
  }

  async #_checkExistingLanguage(code: string): Promise<void> {
    const language = await this.#_prisma.language.findFirst({
      where: {
        code,
      },
    });

    if (language) {
      throw new ConflictException(`${language.title} is already available`);
    }
  }

  async #_checkLanguage(id: string): Promise<void> {
    await this.#_checkId(id);
    const language = await this.#_prisma.language.findFirst({
      where: {
        id,
      },
    });

    if (!language) {
      throw new ConflictException(`Language with ${id} is not exists`);
    }
  }

  async #_checkId(id: string): Promise<void> {
    const isValid = isUUID(id, 4);
    if (!isValid) {
      throw new UnprocessableEntityException(`Invalid ${id} id`);
    }
  }
}
