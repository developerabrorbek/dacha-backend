import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Place } from '@prisma/client';
import { CreatePlaceRequest, UpdatePlaceRequest } from './interfaces';
import { MinioService } from 'client';
import { ConfigService } from '@nestjs/config';
import { TranslateService } from 'modules/translate';

@Injectable()
export class PlaceService {
  #_prisma: PrismaService;
  #_minio: MinioService;
  #_translate: TranslateService;
  #_config: ConfigService;

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

  async createPlace(payload: CreatePlaceRequest): Promise<void> {
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

    await this.#_prisma.place.create({
      data: {
        name: payload.name,
        image: image.image,
        regionId: payload.regionId,
      },
    });
  }

  async getPlaceList(languageCode: string): Promise<Place[]> {
    await this.#_checkLanguage(languageCode);
    const responseData = [];
    const data = await this.#_prisma.place.findMany();
    for (const el of data) {
      const name = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.name,
      });
      responseData.push({
        ...el,
        name: name.value,
      });
    }
    return responseData;
  }

  async updatePlace(payload: UpdatePlaceRequest): Promise<void> {
    const foundedPlace = await this.#_prisma.place.findFirst({
      where: { id: payload.id },
    });

    if (payload?.image) {
      await this.#_minio.removeObject({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        objectName: foundedPlace.image.split('/')[1],
      });

      const image = await this.#_minio.uploadImage({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        file: payload.image,
      });

      await this.#_prisma.place.update({
        where: { id: payload.id },
        data: { image: image?.image },
      });
    }

    if (payload?.name) {
      await this.#_translate.updateTranslate({
        id: foundedPlace.name,
        status: 'inactive',
      });
      await this.#_translate.updateTranslate({
        id: payload.name,
        status: 'active',
      });

      await this.#_prisma.place.update({
        where: { id: payload.id },
        data: { name: payload.name },
      });
    }
  }

  async deletePlace(id: string): Promise<void> {
    const foundedPlace = await this.#_prisma.place.findFirst({ where: { id } });
    if (!foundedPlace) {
      throw new NotFoundException('Place not found');
    }
    await this.#_translate.updateTranslate({
      id: foundedPlace.name,
      status: 'inactive',
    });
    await this.#_minio.removeObject({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      objectName: foundedPlace.image.split('/')[1],
    });

    await this.#_prisma.place.delete({ where: { id: foundedPlace.id } });
  }

  async #_checkLanguage(languageCode: string): Promise<void> {
    const foundedLang = await this.#_prisma.language.findFirst({
      where: { code: languageCode },
    });
    if (!foundedLang) {
      throw new NotFoundException(`Language ${languageCode} not found`);
    }
  }
}
