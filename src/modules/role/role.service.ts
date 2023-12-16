import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleRequest, UpdateRoleRequest } from './interfaces';
import { Role } from '@prisma/client';

@Injectable()
export class Roleservice {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createRole(payload: CreateRoleRequest): Promise<void> {
    await this.#_checkPermissions(payload.permissions);
    await this.#_prisma.role.create({
      data: {
        name: payload.name,
        permissions: {
          set: payload.permissions,
        },
      },
    });
  }

  async getRoleList(): Promise<Role[]> {
    const data = await this.#_prisma.role.findMany({
      include: {
        users: true,
      },
    });
    return data;
  }

  async updateRole(payload: UpdateRoleRequest): Promise<void> {
    await this.#_prisma.role.update({
      where: { id: payload.id },
      data: {
        name: payload.name,
        permissions: {
          set: payload.permissions,
        },
      },
    });
  }

  async deleteRole(id: string): Promise<void> {
    await this.#_prisma.role.delete({ where: { id } });
  }

  async #_checkPermissions(payload: string[]): Promise<void> {
    for (const per of payload) {
      const permission = await this.#_prisma.permission.findFirst({
        where: { id: per },
      });
      if (!permission) throw new NotFoundException('Permission not found');
    }
  }
}
