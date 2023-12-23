import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  AddCottageImageRequest,
  CreateCottageRequest,
  GetComfortsInterface,
  GetCottageListResponse,
  GetCottageTypesInterfaces,
  UpdateCottageImageRequest,
  UpdateCottageRequest,
} from './interfaces';
import { MinioService } from 'client';
import { ConfigService } from '@nestjs/config';
import { TranslateService } from 'modules/translate';

@Injectable()
export class CottageService {
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
    this.#_translate = translate;
    this.#_config = config;
  }

  async createCottage(payload: CreateCottageRequest): Promise<void> {
    await this.#_checkComforts(payload.comforts);
    await this.#_checkCottageTypes(payload.cottageType);
    const cottageImages = [];

    for (const e of payload.images) {
      const image = await this.#_minio.uploadImage({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        file: e.image,
      });

      if (!image?.image) {
        throw new ConflictException('Error while uploading image');
      }

      cottageImages.push({
        image: image.image,
        isMainImage: e.isMain,
      });
    }

    await this.#_prisma.cottage.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        priceWeekend: payload.priceWeekend,
        comforts: payload.comforts,
        rating: 1,
        cottageType: payload.cottageType,
        placeId: payload.placeId,
        regionId: payload.regionId,
        createdBy: '47da9102-ff87-445e-bef8-6b323f8d6c78',
        latitude: payload.latitude,
        longitude: payload.longitude,
        images: {
          createMany: {
            data: cottageImages,
          },
        },
      },
    });
  }

  async getCottageList(
    languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    const data = await this.#_prisma.cottage.findMany();
    for (const cottage of data) {
      const comforts = await this.#_getComforts(cottage.comforts, languageCode);
      const cottageTypes = await this.#_getCottageTypes(
        cottage.cottageType,
        languageCode,
      );
      const region = await this.#_prisma.region.findFirst({
        where: { id: cottage.regionId },
      });
      region.name = (
        await this.#_translate.getSingleTranslate({
          languageCode,
          translateId: region.name,
        })
      ).value;
      const place = await this.#_prisma.place.findFirst({
        where: { id: cottage.placeId },
      });
      place.name = (
        await this.#_translate.getSingleTranslate({
          languageCode,
          translateId: place.name,
        })
      ).value;

      response.push({
        id: cottage.id,
        comforts,
        cottageType: cottageTypes,
        region,
        place,
        name: cottage.name,
        description: cottage.description,
        rating: cottage.rating,
        price: cottage.price,
        priceWeekend: cottage.priceWeekend,
        images: await this.#_prisma.cottageImage.findMany({
          where: { cottageId: cottage.id, status: 'active' },
        }),
        longitude: cottage.latitude,
        latitude: cottage.longitude,
      });
    }
    return response;
  }

  async updateCottage(payload: UpdateCottageRequest): Promise<void> {
    await this.#_checkComforts(payload.comforts);
    await this.#_checkCottageTypes(payload.cottageType);

    await this.#_prisma.cottage.update({
      where: { id: payload.id },
      data: {
        rating: payload.rating,
        cottageType: payload.cottageType,
        comforts: payload.comforts,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        priceWeekend: payload.priceWeekend,
        status: payload.status,
        cottageStatus: payload.cottageStatus,
        latitude: payload.latitude,
        longitude: payload.longitude,
        bookedTime: payload.bookedTime,
      },
    });
  }

  async deleteCottage(id: string): Promise<void> {
    const foundedCottage = await this.#_prisma.cottage.findFirst({
      where: { id },
    });

    if (!foundedCottage) {
      throw new NotFoundException('Cottage not found');
    }

    const images = await this.#_prisma.cottageImage.findMany({
      where: { cottageId: foundedCottage.id },
    });

    for (const image of images) {
      await this.#_minio.removeObject({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        objectName: image.image.split('/')[1],
      });

      await this.#_prisma.cottageImage.delete({ where: { id: image.id } });
    }

    await this.#_prisma.cottage.delete({ where: { id: foundedCottage.id } });
  }

  async addCottageImage(payload: AddCottageImageRequest): Promise<void> {
    const image = await this.#_minio.uploadImage({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      file: payload.image,
    });
    await this.#_prisma.cottageImage.create({
      data: {
        cottageId: payload.cottageId,
        image: image.image,
      },
    });
  }

  async updateCottageImage(payload: UpdateCottageImageRequest): Promise<void> {
    const foundedImage = await this.#_prisma.cottageImage.findFirst({
      where: { id: payload.id },
    });

    let newImage = null;

    if (!foundedImage) {
      throw new NotFoundException('Image not found');
    }

    if (payload.image) {
      await this.#_minio.removeObject({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        objectName: foundedImage.image.split('/')[1],
      });
      newImage = await this.#_minio.uploadImage({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        file: payload.image,
      });
    }

    await this.#_prisma.cottageImage.update({
      where: { id: payload.id },
      data: { image: newImage?.image, status: payload.status },
    });
  }

  async deleteCottageImage(id: string): Promise<void> {
    const foundedImage = await this.#_prisma.cottageImage.findFirst({
      where: { id },
    });

    await this.#_minio.removeObject({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      objectName: foundedImage.image.split('/')[1],
    });

    await this.#_prisma.cottageImage.delete({ where: { id } });
  }

  async #_checkComforts(comforts: string[]): Promise<void> {
    for (const comfort of comforts) {
      const foundedComfort = await this.#_prisma.comfort.findFirst({
        where: { id: comfort },
      });
      if (!foundedComfort) {
        throw new NotFoundException('Comfort not found');
      }
    }
  }

  async #_checkCottageTypes(cottageTypes: string[]): Promise<void> {
    for (const ct of cottageTypes) {
      const foundedCottageType = await this.#_prisma.cottageType.findFirst({
        where: { id: ct },
      });
      if (!foundedCottageType) {
        throw new NotFoundException('Cottage type not found');
      }
    }
  }

  async #_getComforts(
    comforts: string[],
    languageCode: string,
  ): Promise<GetComfortsInterface[]> {
    const response = [];
    for (const c of comforts) {
      const foundedComfort = await this.#_prisma.comfort.findFirst({
        where: { id: c },
      });
      if (!foundedComfort) {
        throw new NotFoundException('Comfort not found');
      }
      const name = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: foundedComfort.name,
      });
      response.push({
        ...foundedComfort,
        name: name.value,
      });
    }
    return response;
  }

  async #_getCottageTypes(
    cottageTypes: string[],
    languageCode: string,
  ): Promise<GetCottageTypesInterfaces[]> {
    const response = [];
    for (const c of cottageTypes) {
      const foundedCottageType = await this.#_prisma.cottageType.findFirst({
        where: { id: c },
      });
      if (!foundedCottageType) {
        throw new NotFoundException('Cottage type not found');
      }
      const name = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: foundedCottageType.name,
      });
      response.push({
        ...foundedCottageType,
        name: name.value,
      });
    }
    return response;
  }
}
