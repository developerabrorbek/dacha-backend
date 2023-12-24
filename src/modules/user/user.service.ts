import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserRequest, UpdateUserRequest } from './interfaces';
import { UserDevice } from '@prisma/client';
import { MinioService } from '@client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  #_prisma: PrismaService;
  #_minio: MinioService;
  #_config: ConfigService;

  constructor(
    prisma: PrismaService,
    minio: MinioService,
    config: ConfigService,
  ) {
    this.#_prisma = prisma;
    this.#_minio = minio;
    this.#_config = config;
  }

  async createUser(payload: CreateUserRequest): Promise<void> {
    await this.#_checkExistingUser(payload.phone);
    await this.#_checkRoles(payload.roles);

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
          assignedBy: '2c0d844f-5c16-4c90-ac5d-c469a142db5f',
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

  async updateUser(payload: UpdateUserRequest): Promise<void> {
    
    if(payload?.favoriteCottages?.length){
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
        await this.#_minio.removeObject({
          bucket: this.#_config.getOrThrow<string>('minio.bucket'),
          objectName: foundedUser.image.split('/')[1],
        });
      }

      const newImage = await this.#_minio.uploadImage({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        file: payload.image,
      });

      await this.#_prisma.user.update({
        where: { id: foundedUser.id },
        data: { image: newImage.image },
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
            assignedBy: '2c0d844f-5c16-4c90-ac5d-c469a142db5f',
            roleId: role,
            userId: foundedUser.id,
          },
        });
      }
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
      await this.#_minio.removeObject({
        bucket: this.#_config.getOrThrow<string>('minio.bucket'),
        objectName: foundedUser.image.split('/')[1],
      });
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
