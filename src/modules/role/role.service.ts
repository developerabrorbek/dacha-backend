import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleRequest, UpdateRoleRequest } from './interfaces';
import { Role } from '@prisma/client';
import { isUUID } from 'class-validator';

@Injectable()
export class Roleservice {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createRole(payload: CreateRoleRequest): Promise<void> {
    // Check all permissions if they exist
    await this.#_checkPermissions(payload.permissions);

    const newRole = await this.#_prisma.role.create({
      data: {
        name: payload.name,
      },
    });

    for (const per of payload.permissions) {
      await this.#_prisma.role_Permission.create({
        data: {
          roleId: newRole.id,
          permissionId: per,
        },
      });
    }
  }

  async getRoleList(): Promise<Role[]> {
    const data = await this.#_prisma.role.findMany({
      include: {
        permissions: true,
      },
    });

    return data;
  }

  async updateRole(payload: UpdateRoleRequest): Promise<void> {
    this.#_checkUUID(payload.id);
    const foundedRole = await this.#_prisma.role.findFirst({
      where: { id: payload.id },
    });

    if (!foundedRole) {
      throw new NotFoundException('Role not found');
    }
    if (payload?.permissions?.length) {
      await this.#_checkPermissions(payload.permissions);

      for (const per of payload.permissions) {
        await this.#_prisma.role_Permission.create({
          data: {
            roleId: foundedRole.id,
            permissionId: per,
          },
        });
      }
    }
    await this.#_prisma.role.update({
      where: { id: payload.id },
      data: {
        name: payload?.name,
      },
    });
  }

  async deleteRole(id: string): Promise<void> {
    this.#_checkUUID(id);
    await this.#_prisma.role.delete({ where: { id } });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4)) {
      throw new ConflictException('Please provide a valid UUID');
    }
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
