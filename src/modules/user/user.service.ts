import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserRequest, UpdateUserRequest } from './interfaces';
import { User, UserDevice } from '@prisma/client';
import { join } from 'path';
import * as fs from 'fs';
import { isArray, isUUID } from 'class-validator';

@Injectable()
export class UserService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createUser(payload: CreateUserRequest): Promise<void> {
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
      await this.#_prisma.user_Role.create({
        data: {
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
      const roles = await this.#_prisma.user_Role.findMany({
        where: {
          userId: user.id,
        },
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      const devices = await this.#_prisma.userDevice.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          deviceId: true,
          deviceName: true,
          deviceType: true,
          platform: true,
          isActive: true,
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
    this.#_checkUUID(id);
    const user = await this.#_prisma.user.findFirst({
      where: { id: id },
      include: {
        cottages: true,
        notifications: true,
        transactions: true,
        orders: {
          include: {
            tariff: {
              include: {
                service: true
              }
            }
          }
        },
        roles: true,
        userDevices: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const transactions = user.transactions?.length && user.transactions.map(tr => {
      return {
        ...tr,
        cancelTime: Number(tr.cancelTime),
        performTime: Number(tr.performTime),
        createTime: Number(tr.createTime),
      }
    })

    // const roles = await this.#_prisma.user_Role.findMany({
    //   where: {
    //     userId: user.id,
    //   },
    //   select: {
    //     role: true,
    //   },
    // });

    // const devices = await this.#_prisma.userDevice.findMany({
    //   where: {
    //     userId: user.id,
    //   },
    //   select: {
    //     id: true,
    //     deviceId: true,
    //     deviceName: true,
    //     deviceType: true,
    //     platform: true,
    //     isActive: true,
    //   },
    // });

    return {...user, transactions};
  }

  async getSingleUserByUserID(id: string): Promise<User> {
    this.#_checkUUID(id);
    const user = await this.#_prisma.user.findFirst({
      where: { id: id },
      include: {
        userDevices: true,
        notifications: true,
        cottages: true,
        orders: true,
        roles: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUser(payload: UpdateUserRequest, userId: string): Promise<void> {
    this.#_checkUUID(userId);

    if (!userId) {
      throw new ConflictException('Please provide Bearer token');
    }

    const userRoles = [];

    if (!isArray(payload.roles) && payload?.roles) {
      userRoles.push(payload.roles);
    }

    if (isArray(payload?.roles)) {
      userRoles.push(...payload.roles);
    }

    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: payload.id },
    });

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    if (payload?.image) {
      if (foundedUser.image) {
        fs.unlink(
          join(process.cwd(), foundedUser.image),
          (): unknown => undefined,
        );
      }

      const imagePath = payload.image.path.replace('\\', '/');

      const image = imagePath.replace('\\', '/');

      await this.#_prisma.user.update({
        where: { id: foundedUser.id },
        data: { image: image },
      });
    }

    if (userRoles.length) {
      await this.#_checkRoles(userRoles);
      await this.#_prisma.user_Role.deleteMany({
        where: { userId: foundedUser.id },
      });
      for (const role of userRoles) {
        await this.#_prisma.user_Role.create({
          data: {
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
        password: payload.password,
        phone: payload.phone,
        username: payload.username,
      },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    this.#_checkUUID(userId);
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: userId },
    });
    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    if (foundedUser?.image) {
      fs.unlink(
        join(process.cwd(), foundedUser.image),
        (): unknown => undefined,
      );
    }

    await this.#_prisma.user.delete({ where: { id: userId } });
  }

  async getUserDevices(userId: string): Promise<UserDevice[]> {
    this.#_checkUUID(userId);
    return await this.#_prisma.userDevice.findMany({ where: { userId } });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4)) {
      throw new ConflictException('Please provide a valid UUID');
    }
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
        throw new NotFoundException(`Role ${role} not found`);
      }
    }
  }
}
