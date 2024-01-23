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
  GetFilteredCottagesRequest,
  UpdateCottageImageRequest,
  UpdateCottageRequest,
} from './interfaces';
import * as fs from 'fs';
import { TranslateService } from 'modules/translate';
import { join } from 'path';
import { isArray } from 'class-validator';

@Injectable()
export class CottageService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createCottage(
    payload: Omit<CreateCottageRequest, 'createdBy'>,
    userId: string,
  ): Promise<void> {
    const comforts = [];
    if (isArray(payload.comforts)) {
      await this.#_checkComforts(payload.comforts);
      comforts.push(...payload.comforts);
    } else {
      comforts.push(payload.comforts);
    }

    const cottageType = [];
    if (isArray(payload.cottageType)) {
      await this.#_checkCottageTypes(payload.cottageType);
      cottageType.push(...payload.cottageType);
    }else {
      cottageType.push(payload.cottageType);
    }
    
    const cottageImages = [];

    for (const e of payload.images) {
      const imagePath = e.path.replace('\\', '/');

      console.log(imagePath.replace('\\', '/'));

      cottageImages.push({
        image: imagePath.replace('\\', '/'),
        isMainImage: false,
      });
    }

    await this.#_prisma.cottage.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        priceWeekend: Number(payload.priceWeekend),
        comforts: payload.comforts,
        rating: 1,
        cottageType: payload.cottageType,
        placeId: payload.placeId,
        regionId: payload.regionId,
        createdBy: userId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        images: {
          createMany: {
            data: cottageImages,
          },
        },
        cottageStatus: payload.cottageStatus,
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
        cottageStatus: cottage.cottageStatus,
        isTop: cottage.isTop,
      });
    }
    return response;
  }

  async getFilteredCottageList(
    payload: GetFilteredCottagesRequest,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    const data = await this.#_prisma.cottage.findMany({
      where: {
        OR: [
          {
            cottageType: {
              has: payload.cottageType,
            },
            price: {
              lte: payload.price,
            },
          },
        ],
        regionId: payload.regionId,
        cottageStatus: 'confirmed',
      },
    });
    for (const cottage of data) {
      const comforts = await this.#_getComforts(
        cottage.comforts,
        payload.languageCode,
      );
      const cottageTypes = await this.#_getCottageTypes(
        cottage.cottageType,
        payload.languageCode,
      );
      const region = await this.#_prisma.region.findFirst({
        where: { id: cottage.regionId },
      });
      region.name = (
        await this.#_translate.getSingleTranslate({
          languageCode: payload.languageCode,
          translateId: region.name,
        })
      ).value;
      const place = await this.#_prisma.place.findFirst({
        where: { id: cottage.placeId },
      });
      place.name = (
        await this.#_translate.getSingleTranslate({
          languageCode: payload.languageCode,
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
        cottageStatus: cottage.cottageStatus,
      });
    }
    return response;
  }

  async getCottageListByCottageType(
    languageCode: string,
    cottageTypeId: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    const data = await this.#_prisma.cottage.findMany({
      where: {
        cottageType: {
          has: cottageTypeId,
        },
        cottageStatus: 'confirmed',
      },
    });
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
        cottageStatus: cottage.cottageStatus,
      });
    }
    return response;
  }

  async getCottageListByPlace(
    languageCode: string,
    placeId: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    const data = await this.#_prisma.cottage.findMany({
      where: {
        placeId: placeId,
        cottageStatus: 'confirmed',
      },
    });
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
        cottageStatus: cottage.cottageStatus,
      });
    }
    return response;
  }

  async getCottageListByUser(
    languageCode: string,
    userId: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];

    const data = await this.#_prisma.cottage.findMany({
      where: {
        createdBy: userId,
      },
    });
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
        cottageStatus: cottage.cottageStatus,
      });
    }
    return response;
  }

  async getTopCottageList(
    languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    const data = await this.#_prisma.cottage.findMany({
      where: { isTop: true },
    });
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
        cottageStatus: cottage.cottageStatus,
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
        isTop: payload.isTop,
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
      fs.unlink(join(process.cwd(), image.image), () => console.log('err'));

      await this.#_prisma.cottageImage.delete({ where: { id: image.id } });
    }

    await this.#_prisma.cottage.delete({ where: { id: foundedCottage.id } });
  }

  async addCottageImage(payload: AddCottageImageRequest): Promise<void> {
    if (!payload.image?.path) {
      throw new ConflictException('Error on upload image');
    }
    const imagePath = payload.image.path.replace('\\', '/');
    await this.#_prisma.cottageImage.create({
      data: {
        cottageId: payload.cottageId,
        image: imagePath.replace('\\', '/'),
        isMainImage: payload.isMainImage || false,
      },
    });
  }

  async updateCottageImage(payload: UpdateCottageImageRequest): Promise<void> {
    const foundedImage = await this.#_prisma.cottageImage.findFirst({
      where: { id: payload.id },
    });

    if (!foundedImage) {
      throw new NotFoundException('Image not found');
    }

    if (payload.image?.path) {
      fs.unlink(join(process.cwd(), foundedImage.image), () =>
        console.log('err'),
      );
      const imagePath = payload.image.path.replace('\\', '/');

      const newImage = imagePath.replace('\\', '/');

      await this.#_prisma.cottageImage.update({
        where: { id: payload.id },
        data: { image: newImage },
      });
    }

    await this.#_prisma.cottageImage.update({
      where: { id: payload.id },
      data: { status: payload.status },
    });
  }

  async deleteCottageImage(id: string): Promise<void> {
    const foundedImage = await this.#_prisma.cottageImage.findFirst({
      where: { id },
    });

    fs.unlink(join(process.cwd(), foundedImage.image), () =>
      console.log('err'),
    );

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
