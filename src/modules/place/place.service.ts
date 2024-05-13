import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Place } from '@prisma/client';
import { CreatePlaceRequest, UpdatePlaceImageRequest, UpdatePlaceImageResponse, UpdatePlaceRequest } from './interfaces';
import { TranslateService } from 'modules/translate';
import { join } from 'path';
import * as fs from 'fs';
import { isUUID } from 'class-validator';

@Injectable()
export class PlaceService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createPlace(payload: CreatePlaceRequest): Promise<void> {
    if (!payload.image?.path) {
      throw new ConflictException('Error while uploading image');
    }

    const imagePath = payload.image.path.replace('\\', '/');

    await this.#_translate.updateTranslate({
      id: payload.name,
      status: 'active',
    });

    await this.#_prisma.place.create({
      data: {
        name: payload.name,
        image: imagePath.replace('\\', '/'),
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

  async getPlaceListByRegion(
    languageCode: string,
    regionId: string,
  ): Promise<Place[]> {
    await this.#_checkLanguage(languageCode);
    this.#_checkUUID(regionId);

    const foundedRegion = await this.#_prisma.region.findFirst({
      where: { id: regionId },
    });

    if (!foundedRegion) throw new NotFoundException('Region not found');

    const responseData = [];
    const data = await this.#_prisma.place.findMany({ where: { regionId } });
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
    this.#_checkUUID(payload.id);
    const foundedPlace = await this.#_prisma.place.findFirst({
      where: { id: payload.id },
    });

    if (!foundedPlace) {
      throw new NotFoundException('Place not found');
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

  async updatePlaceImage(payload: UpdatePlaceImageRequest): Promise<UpdatePlaceImageResponse> {
    this.#_checkUUID(payload.id);
    const foundedPlace = await this.#_prisma.place.findFirst({
      where: { id: payload.id },
    });

    if (!foundedPlace) {
      throw new NotFoundException('Place not found');
    }

      fs.unlink(
        join(process.cwd(), foundedPlace.image),
        (): unknown => undefined,
      );

      const imagePath = payload.image.path.replace('\\', '/');

      const image = imagePath.replace('\\', '/');

      await this.#_prisma.place.update({
        where: { id: payload.id },
        data: { image: image },
      });

      return {
        newImage: image
      }
  }

  async deletePlace(id: string): Promise<void> {
    this.#_checkUUID(id);
    const foundedPlace = await this.#_prisma.place.findFirst({ where: { id } });
    if (!foundedPlace) {
      throw new NotFoundException('Place not found');
    }
    await this.#_translate.updateTranslate({
      id: foundedPlace.name,
      status: 'inactive',
    });

    fs.unlink(
      join(process.cwd(), foundedPlace.image),
      (): unknown => undefined,
    );

    await this.#_prisma.place.delete({ where: { id: foundedPlace.id } });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4)) {
      throw new ConflictException('Please provide a valid UUID');
    }
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
