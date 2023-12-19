import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Place } from '@prisma/client';
import { CreatePlaceRequest, UpdatePlaceRequest } from './interfaces';
import { MinioService } from 'client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlaceService {
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

  async createPlace(payload: CreatePlaceRequest): Promise<void> {
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
    console.log(languageCode, 'getplaces');
    return await this.#_prisma.place.findMany();
  }

  async updatePlace(payload: UpdatePlaceRequest): Promise<void> {
    let image = null

    if(payload.image){
      image = await this.#_minio.uploadImage({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        file: payload.image,
      });
    }

    if (!image?.image) {
      throw new ConflictException('Error while uploading image');
    }

    await this.#_prisma.place.update({
      where: { id: payload.id },
      data: { name: payload.name, image: image?.image },
    });
  }

  async deletePlace(id: string): Promise<void> {
    await this.#_prisma.place.delete({ where: { id } });
  }
}
