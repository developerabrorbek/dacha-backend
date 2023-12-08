import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Cottage } from '@prisma/client';
import {
  CreateCottageRequest,
  UpdateCottageImageRequest,
  UpdateCottageRequest,
} from './interfaces';
import { MinioService } from 'client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CottageService {
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

  async createCottage(payload: CreateCottageRequest): Promise<void> {
    const cottageImagesCreateArr = [];

    for (const e of payload.images) {
      const image = await this.#_minio.uploadImage({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        file: e,
      });

      if (!image?.image) {
        throw new ConflictException('Error while uploading image');
      }

      cottageImagesCreateArr.push({
        image: image.image,
      });
    }

    const comfortsConnectArr = payload.comforts.map((e) => {
      return {
        id: e,
      };
    });

    await this.#_prisma.cottage.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        priceWeekend: payload.priceWeekend,
        rating: payload.rating,
        comforts: {
          connect: comfortsConnectArr,
        },
        cottageType: payload.cottageType,
        images: {
          create: cottageImagesCreateArr,
        },
        placeId: payload.placeId,
        regionId: payload.regionId,
      },
    });
  }

  async getCottageList(languageCode: string): Promise<Cottage[]> {
    console.log(languageCode, 'getcottages');
    return await this.#_prisma.cottage.findMany();
  }

  async updateCottage(payload: UpdateCottageRequest): Promise<void> {
    const image = await this.#_minio.uploadImage({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      file: payload.image,
    });

    if (!image?.image) {
      throw new ConflictException('Error while uploading image');
    }

    const newImage = { id: null };

    if (image.image) {
      const data = await this.#_prisma.cottageImage.create({
        data: { image: image.image },
        select: { id: true },
      });
      newImage.id = data.id;
    }

    const addComfortArr = payload.comforts.map((e) => {
      return {
        id: e,
      };
    });

    await this.#_prisma.cottage.update({
      where: { id: payload.id },
      data: {
        images: {
          connectOrCreate: {
            where: { id: newImage.id },
            create: {
              image: image.image,
            },
          },
        },
        rating: payload.rating,
        cottageType: payload.cottageType,
        comforts: {
          connect: addComfortArr,
        },
        name: payload.name,
        description: payload.description,
        price: payload.price,
        priceWeekend: payload.priceWeekend,
        status: payload.status,
        cottageStatus: payload.cottageStatus,
      },
    });
  }

  async deleteCottage(id: string): Promise<void> {
    await this.#_prisma.cottage.delete({ where: { id } });
  }

  async updateCottageImage(payload: UpdateCottageImageRequest): Promise<void> {
    await this.#_prisma.cottageImage.update({
      where: { id: payload.id },
      data: { isMainImage: payload.mainImage, status: payload.status },
    });
  }

  async deleteCottageImage(id: string): Promise<void> {
    await this.#_prisma.cottageImage.delete({ where: { id } });
  }
}
