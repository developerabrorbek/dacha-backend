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
  GetSuitableCottageListRequest,
  GetSuitableCottageListResponse,
  UpdateCottageImageRequest,
  UpdateCottageRequest,
} from './interfaces';
import * as fs from 'fs';
import { TranslateService } from 'modules/translate';
import { join } from 'path';
import { isArray, isUUID } from 'class-validator';

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
    if (!payload.files?.mainImage?.length) {
      throw new ConflictException('Please provide a main image');
    }

    if (!userId) {
      throw new ConflictException('Please provide Bearer token');
    }

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
    } else {
      cottageType.push(payload.cottageType);
    }

    const cottageImages = [];

    for (const e of payload.files?.images) {
      const imagePath = e.path.replace('\\', '/');

      cottageImages.push({
        image: imagePath.replace('\\', '/'),
        isMainImage: false,
      });
    }

    cottageImages.push({
      image: payload.files?.mainImage[0].path
        .replace('\\', '/')
        .replace('\\', '/'),
      isMainImage: true,
    });

    await this.#_prisma.cottage.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        priceWeekend: Number(payload.priceWeekend),
        comforts: comforts,
        rating: 1,
        cottageType: cottageType,
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

    const data = await this.#_prisma.cottage.findMany({
      include: { Orders: true },
    });

    for (const cottage of data) {
      const data = await this.#_getCottage(cottage, languageCode);

      // Find who created the cottage
      const user = await this.#_prisma.user.findFirst({
        where: { id: cottage.createdBy },
      });

      response.push({ ...data, user });
    }

    return response;
  }

  async getSuitableCottageList(
    payload: GetSuitableCottageListRequest,
  ): Promise<GetSuitableCottageListResponse[]> {
    const response = [];
    this.#_checkUUID(payload.cottageId);

    const foundedCottage = await this.#_prisma.cottage.findFirst({
      where: { id: payload.cottageId },
    });

    if (!foundedCottage) throw new NotFoundException('Cottage not found');

    const data = await this.#_prisma.cottage.findMany({
      where: {
        OR: [
          {
            placeId: foundedCottage.placeId,
          },
          {
            regionId: foundedCottage.regionId,
          },
          {
            price: {
              lte: foundedCottage.price + 100,
            },
          },
        ],
      },
    });

    for (const cottage of data) {
      const data = await this.#_getCottage(cottage, payload.languageCode);

      // Find who created the cottage
      const user = await this.#_prisma.user.findFirst({
        where: { id: cottage.createdBy },
      });

      response.push({ ...data, user });
    }

    return response;
  }

  async getFilteredCottageList(
    payload: GetFilteredCottagesRequest,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    if (!payload.cottageType || payload.cottageType == 'undefined') {
      payload.cottageType = '';
    }

    if (!payload.placeId || payload.placeId == 'undefined') {
      payload.placeId = undefined;
    }

    const data = await this.#_prisma.cottage.findMany({
      where: {
        AND: [
          {
            cottageType: {
              hasSome: [payload.cottageType],
            },
            price: {
              lte: payload.price,
            },
            placeId: payload.placeId,
          },
        ],
        cottageStatus: 'confirmed',
      },
    });
    for (const cottage of data) {
      const data = await this.#_getCottage(cottage, payload.languageCode);
      response.push(data);
    }
    return response;
  }

  async getCottageListByCottageType(
    languageCode: string,
    cottageTypeId: string,
  ): Promise<GetCottageListResponse[]> {
    this.#_checkUUID(cottageTypeId);
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
      const data = await this.#_getCottage(cottage, languageCode);
      response.push(data);
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
      const data = await this.#_getCottage(cottage, languageCode);
      response.push(data);
    }
    return response;
  }

  async getCottageListByUser(
    languageCode: string,
    userId: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];

    this.#_checkUUID(userId);

    const data = await this.#_prisma.cottage.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        Orders: true,
      },
    });

    for (const cottage of data) {
      const data = await this.#_getCottage(cottage, languageCode);
      response.push(data);
    }
    return response;
  }

  async getTopCottageList(
    languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    const data = await this.#_prisma.cottage.findMany({
      where: {
        Orders: {
          some: {
            orderStatus: 'success',
            status: 'active',
            tariff: {
              service: {
                serviceCode: 'top',
              },
            },
          },
        },
      },
    });
    for (const cottage of data) {
      const data = await this.#_getCottage(cottage, languageCode);
      response.push(data);
    }
    return response;
  }

  async getRecommendedCottageList(
    languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    const response = [];
    const data = await this.#_prisma.cottage.findMany({
      where: {
        OR: [
          {
            Orders: {
              some: {
                orderStatus: 'success',
                status: 'active',
                tariff: {
                  service: {
                    serviceCode: 'recommended',
                  },
                },
              },
            },
          },
        ],
      },
      orderBy: {
        Orders: {
          _count: 'desc',
        },
      },
    });
    for (const cottage of data) {
      const data = await this.#_getCottage(cottage, languageCode);
      response.push(data);
    }
    return response;
  }

  async updateCottage(payload: UpdateCottageRequest): Promise<void> {
    this.#_checkUUID(payload.id);
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
    } else {
      cottageType.push(payload.cottageType);
    }

    await this.#_checkComforts(comforts);
    await this.#_checkCottageTypes(cottageType);

    await this.#_prisma.cottage.update({
      where: { id: payload.id },
      data: {
        rating: payload.rating,
        cottageType: cottageType,
        comforts: comforts,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        priceWeekend: payload.priceWeekend,
        status: payload.status,
        cottageStatus: payload.cottageStatus,
        latitude: payload.latitude,
        longitude: payload.longitude,
      },
    });
  }

  async deleteCottage(id: string): Promise<void> {
    this.#_checkUUID(id);
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
    this.#_checkUUID(payload.id);
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
    this.#_checkUUID(id);
    const foundedImage = await this.#_prisma.cottageImage.findFirst({
      where: { id },
    });

    fs.unlink(join(process.cwd(), foundedImage.image), () =>
      console.log('err'),
    );

    await this.#_prisma.cottageImage.delete({ where: { id } });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4)) {
      throw new ConflictException('Provide a valid UUID');
    }
  }

  async #_getCottage(cottage: any, languageCode: string): Promise<any> {
    // get comforts with translations
    const comforts = await this.#_getComforts(cottage.comforts, languageCode);

    // get cottage-types with translations
    const cottageTypes = await this.#_getCottageTypes(
      cottage.cottageType,
      languageCode,
    );

    // Get region translate
    const region = await this.#_prisma.region.findFirst({
      where: { id: cottage.regionId },
    });
    region.name = (
      await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: region.name,
      })
    ).value;

    // Get place translate
    const place = await this.#_prisma.place.findFirst({
      where: { id: cottage.placeId },
    });
    place.name = (
      await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: place.name,
      })
    ).value;

    return {
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
      status: cottage.status,
      tariffs: cottage.tariffs,
      user: cottage?.user,
    };
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
