import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateModelRequest, UpdateModelRequest } from './interfaces';
import { Models } from '@prisma/client';
import { isUUID } from 'class-validator';

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
    this.#_checkUUID(payload.id)
    await this.#_prisma.models.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteModel(id: string): Promise<void> {
    this.#_checkUUID(id)
    await this.#_prisma.models.delete({ where: { id } });
  }

  #_checkUUID(id: string): void{
    if(!isUUID(id, 4)){
      throw new ConflictException("Please provide a valid UUID")
    }
  }
}
