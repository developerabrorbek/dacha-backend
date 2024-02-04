import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePermissionRequest, UpdatePermissionRequest } from './interfaces';
import { Permission } from '@prisma/client';
import { isUUID } from 'class-validator';

@Injectable()
export class Permissionservice {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createPermission(payload: CreatePermissionRequest): Promise<void> {
    await this.#_prisma.permission.create({
      data: { name: payload.name, modelId: payload.modelId, code: payload.code },
    });
  }

  async getPermissionList(): Promise<Permission[]> {
    const data = await this.#_prisma.permission.findMany({
      include: {
        model: true,
      },
    });
    return data;
  }

  async updatePermission(payload: UpdatePermissionRequest): Promise<void> {
    this.#_checkUUID(payload.id)
    await this.#_prisma.permission.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deletePermission(id: string): Promise<void> {
    this.#_checkUUID(id)
    await this.#_prisma.permission.delete({ where: { id } });
  }

  #_checkUUID(id: string): void{
    if(!isUUID(id, 4)){
      throw new ConflictException("Please provide a valid UUID")
    }
  }
}
