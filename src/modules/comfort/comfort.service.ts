import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Comfort } from '@prisma/client';
import { CreateComfortRequest, UpdateComfortRequest } from './interfaces';
import { MinioService } from 'client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComfortService {
  #_prisma: PrismaService;
  #_minio: MinioService;
  #_config: ConfigService;

  constructor(
    prisma: PrismaService,
    minio: MinioService,
    config: ConfigService,
  ) {
    this.#_prisma = prisma;
    this.#_minio = minio;
    this.#_config = config;
  }

  async createComfort(payload: CreateComfortRequest): Promise<void> {
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
    console.log(languageCode, 'getcomfort');
    return await this.#_prisma.comfort.findMany();
  }

  async updateComfort(payload: UpdateComfortRequest): Promise<void> {
    const image = await this.#_minio.uploadImage({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      file: payload.image,
    });

    if (!image?.image) {
      throw new ConflictException('Error while uploading image');
    }

    await this.#_prisma.comfort.update({
      where: { id: payload.id },
      data: { name: payload.name, image: image.image },
    });
  }

  async deleteComfort(id: string): Promise<void> {
    await this.#_prisma.comfort.delete({ where: { id } });
  }
}
