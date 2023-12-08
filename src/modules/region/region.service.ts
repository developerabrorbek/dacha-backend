import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRegionRequest, UpdateRegionRequest } from './interfaces';
import { Region } from '@prisma/client';

@Injectable()
export class RegionService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createRegion(payload: CreateRegionRequest): Promise<void> {
    await this.#_prisma.region.create({ data: { name: payload.name } });
  }

  async getRegionList(languageCode: string): Promise<Region[]> {
    console.log(languageCode, 'getregions');
    return await this.#_prisma.region.findMany();
  }

  async updateRegion(payload: UpdateRegionRequest): Promise<void> {
    await this.#_prisma.region.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteRegion(id: string): Promise<void> {
    await this.#_prisma.region.delete({ where: { id } });
  }
}
