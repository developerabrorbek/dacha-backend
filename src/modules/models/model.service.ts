import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateModelRequest, UpdateModelRequest } from './interfaces';
import { Models } from '@prisma/client';

@Injectable()
export class Modelservice {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createModel(payload: CreateModelRequest): Promise<void> {
    await this.#_prisma.models.create({
      data: { name: payload.name },
    });
  }

  async getModelsList(): Promise<Models[]> {
    const data = await this.#_prisma.models.findMany({
      include: {
        permission: true,
      },
    });
    return data;
  }

  async updateModel(payload: UpdateModelRequest): Promise<void> {
    await this.#_prisma.models.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteModel(id: string): Promise<void> {
    await this.#_prisma.models.delete({ where: { id } });
  }
}
