import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserRequest, UpdateUserRequest } from './interfaces';
import { UserDevice } from '@prisma/client';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createUser(payload: CreateUserRequest, userId): Promise<void> {
    await this.#_checkExistingUser(payload.phone);
    await this.#_checkRoles(payload.roles);

    if (payload?.phone) {
      const foundedPhone = await this.#_prisma.user.findFirst({
        where: { phone: payload.phone },
      });
      if (foundedPhone)
        throw new ConflictException(
          `User with this ${payload.phone} phone already exists`,
        );
    }

    if (payload?.username) {
      const foundedUsername = await this.#_prisma.user.findFirst({
        where: { username: payload.username },
      });
      if (foundedUsername)
        throw new ConflictException(
          `User with this ${payload.username} username already exists`,
        );
    }

    const newUser = await this.#_prisma.user.create({
      data: {
        phone: payload.phone,
        username: payload.username,
        password: payload.password,
        name: payload.name,
      },
      select: {
        id: true,
      },
    });

    for (const role of payload.roles) {
      await this.#_prisma.userOnRole.create({
        data: {
          assignedBy: userId,
          roleId: role,
          userId: newUser.id,
        },
      });
    }
  }

  async getUserList(): Promise<any[]> {
    const response = [];
    const data = await this.#_prisma.user.findMany();
    for (const user of data) {
      const roles = await this.#_prisma.userOnRole.findMany({
        where: {
          userId: user.id,
        },
        select: {
          role: true,
        },
      });

      const devices = await this.#_prisma.userDevice.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          ip: true,
          userAgent: true,
        },
      });

      response.push({
        ...user,
        roles,
        devices,
      });
    }
    return response;
  }

  async getSingleUser(id: string): Promise<any> {
    const user = await this.#_prisma.user.findFirst({ where: { id: id } });

    const roles = await this.#_prisma.userOnRole.findMany({
      where: {
        userId: user.id,
      },
      select: {
        role: true,
      },
    });

    const devices = await this.#_prisma.userDevice.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        ip: true,
        userAgent: true,
      },
    });

    return {
      ...user,
      roles,
      devices,
    };
  }

  async updateUser(payload: UpdateUserRequest, userId: string): Promise<void> {
    if (payload?.favoriteCottages?.length) {
      await this.#_checkCottages(payload.favoriteCottages);
    }

    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: payload.id },
    });

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    if (payload?.image) {
      if (foundedUser.image) {
        fs.unlink(join(process.cwd(), foundedUser.image), () =>
          console.log('err'),
        );
      }

      const imagePath = payload.image.path.replace('\\', '/');

      const image = imagePath.replace('\\', '/');

      await this.#_prisma.user.update({
        where: { id: foundedUser.id },
        data: { image: image },
      });
    }

    if (payload?.roles) {
      await this.#_checkRoles(payload.roles);
      await this.#_prisma.userOnRole.deleteMany({
        where: { userId: foundedUser.id },
      });
      for (const role of payload.roles) {
        await this.#_prisma.userOnRole.create({
          data: {
            assignedBy: userId,
            roleId: role,
            userId: foundedUser.id,
          },
        });
      }
    }

    if (payload?.phone) {
      const foundedPhone = await this.#_prisma.user.findFirst({
        where: { phone: payload.phone },
      });
      if (foundedPhone)
        throw new ConflictException(
          `User with this ${payload.phone} phone already exists`,
        );
    }

    if (payload?.username) {
      const foundedUsername = await this.#_prisma.user.findFirst({
        where: { username: payload.username },
      });
      if (foundedUsername)
        throw new ConflictException(
          `User with this ${payload.username} username already exists`,
        );
    }

    await this.#_prisma.user.update({
      where: { id: payload.id },
      data: {
        name: payload.name,
        email: payload.email,
        favoriteCottages: payload.favoriteCottages,
        password: payload.password,
        phone: payload.phone,
        username: payload.username,
      },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: userId },
    });
    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    if (foundedUser?.image) {
      fs.unlink(join(process.cwd(), foundedUser.image), () =>
        console.log('err'),
      );
    }

    await this.#_prisma.userOnRole.deleteMany({
      where: { userId: foundedUser.id },
    });
    await this.#_prisma.userDevice.deleteMany({
      where: { userId: foundedUser.id },
    });
    await this.#_prisma.user.delete({ where: { id: userId } });
  }

  async getUserDevices(userId: string): Promise<UserDevice[]> {
    return await this.#_prisma.userDevice.findMany({ where: { userId } });
  }

  async #_checkExistingUser(phone: string): Promise<void> {
    const user = await this.#_prisma.user.findFirst({ where: { phone } });
    if (user) {
      throw new ConflictException(`User ${phone} already exists`);
    }
  }

  async #_checkRoles(roles: string[]): Promise<void> {
    for (const role of roles) {
      const foundedRole = await this.#_prisma.role.findFirst({
        where: { id: role },
      });
      if (!foundedRole) {
        throw new NotFoundException('Role ${role} not found');
      }
    }
  }

  async #_checkCottages(cottages: string[]): Promise<void> {
    for (const cottage of cottages) {
      const foundedCottage = await this.#_prisma.cottage.findFirst({
        where: { id: cottage },
      });
      if (!foundedCottage) {
        throw new NotFoundException(`Cottage ${cottage} not found`);
      }
    }
  }
}
