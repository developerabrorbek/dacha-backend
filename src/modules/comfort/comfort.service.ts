import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Comfort } from '@prisma/client';
import { CreateComfortRequest, UpdateComfortRequest } from './interfaces';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import { TranslateService } from 'modules/translate';
import { join } from 'node:path';

@Injectable()
export class ComfortService {
  #_prisma: PrismaService;
  #_config: ConfigService;
  #_translate: TranslateService;

  constructor(
    prisma: PrismaService,
    config: ConfigService,
    translate: TranslateService,
  ) {
    this.#_prisma = prisma;
    this.#_config = config;
    this.#_translate = translate;
  }

  async createComfort(payload: CreateComfortRequest): Promise<void> {
    if (!payload.image?.path) {
      throw new ConflictException('Error while uploading image');
    }

    const imagePath = payload.image.path.replace('\\', '/');

    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });

    await this.#_prisma.comfort.create({
      data: {
        name: payload.name,
        image: imagePath.replace('\\', '/'),
      },
    });
  }

  async getComfortList(languageCode: string): Promise<Comfort[]> {
    const data = await this.#_prisma.comfort.findMany();
    for (const el of data) {
      const name = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.name,
      });
      el.name = name.value;
    }
    return data;
  }

  async updateComfort(payload: UpdateComfortRequest): Promise<void> {
    const foundedComfort = await this.#_prisma.comfort.findFirst({
      where: { id: payload.id },
    });


    if (!foundedComfort) {
      throw new NotFoundException('Comfort not found');
    }
    let image = null;

    if (payload.name) {
      await this.#_translate.updateTranslate({
        id: foundedComfort.name,
        status: 'inactive',
      });
      await this.#_translate.updateTranslate({
        id: payload.name,
        status: 'active',
      });

      await this.#_prisma.comfort.update({
        where: { id: payload.id },
        data: { name: payload?.name },
      });
    }

    if (payload.image?.path) {
      fs.unlink(join(process.cwd(), foundedComfort.image), () =>
        console.log("err"),
      );

      const imagePath = payload.image.path.replace('\\', '/');

      image = imagePath.replace('\\', '/');

      await this.#_prisma.comfort.update({
        where: { id: payload.id },
        data: { image: image },
      });
    }
  }

  async deleteComfort(id: string): Promise<void> {
    const foundedComfort = await this.#_prisma.comfort.findFirst({
      where: { id: id },
    });

    fs.unlink(join(process.cwd(), foundedComfort.image), () =>
      console.log("err"),
    );

    await this.#_translate.updateTranslate({
      id: foundedComfort.name,
      status: 'inactive',
    });
    await this.#_prisma.comfort.delete({ where: { id } });
  }
}
