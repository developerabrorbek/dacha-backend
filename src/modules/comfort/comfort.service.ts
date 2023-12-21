import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Comfort } from '@prisma/client';
import { CreateComfortRequest, UpdateComfortRequest } from './interfaces';
import { MinioService } from 'client';
import { ConfigService } from '@nestjs/config';
import { TranslateService } from 'modules/translate';

@Injectable()
export class ComfortService {
  #_prisma: PrismaService;
  #_minio: MinioService;
  #_config: ConfigService;
  #_translate: TranslateService;

  constructor(
    prisma: PrismaService,
    minio: MinioService,
    config: ConfigService,
    translate: TranslateService,
  ) {
    this.#_prisma = prisma;
    this.#_minio = minio;
    this.#_config = config;
    this.#_translate = translate;
  }

  async createComfort(payload: CreateComfortRequest): Promise<void> {
    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });

    const image = await this.#_minio.uploadImage({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      file: payload.image,
    });

    if (!image?.image) {
      throw new ConflictException('Error while uploading image');
    }

    await this.#_prisma.comfort.create({
      data: {
        name: payload.name,
        image: image.image,
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

    if(!foundedComfort){
      throw new NotFoundException("Comfort not found")
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
    }

    if (payload.image) {
      await this.#_minio.removeObject({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        objectName: foundedComfort.image.split('/')[1],
      });
      image = await this.#_minio.uploadImage({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        file: payload.image,
      });
    }

    await this.#_prisma.comfort.update({
      where: { id: payload.id },
      data: { name: payload?.name, image: image?.image },
    });
  }

  async deleteComfort(id: string): Promise<void> {
    const foundedComfort = await this.#_prisma.comfort.findFirst({
      where: { id: id },
    });
    await this.#_minio.removeObject({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      objectName: foundedComfort.image.split('/')[1],
    });
    await this.#_translate.updateTranslate({
      id: foundedComfort.name,
      status: 'inactive',
    });
    await this.#_prisma.comfort.delete({ where: { id } });
  }
}
