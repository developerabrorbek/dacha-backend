import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserRequest, UpdateUserRequest } from './interfaces';
import { User, UserDevice } from '@prisma/client';
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
      },
      select: {
        id: true,
      },
    });

    for (const role of payload.roles) {
      await this.#_prisma.user.update({
        where: { id: newUser.id },
        data: {
          roles: {
            connect: {
              userId_roleId: {
                roleId: role,
                userId: newUser.id,
              },
            },
          },
        },
      });
    }
  }

  async getUserList(): Promise<User[]> {
    return await this.#_prisma.user.findMany();
  }

  async updateUser(payload: UpdateUserRequest): Promise<void> {
    await this.#_checkRoles(payload.roles);
    await this.#_checkCottages(payload.favoriteCottages);

    const newImage = await this.#_minio.uploadImage({
      bucket: this.#_config.getOrThrow<string>('minio.bucket'),
      file: payload.image,
    });

    for (const role of payload.roles) {
      await this.#_prisma.user.update({
        where: { id: payload.id },
        data: {
          roles: {
            connect: {
              userId_roleId: {
                roleId: role,
                userId: payload.id,
              },
            },
          },
        },
      });
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
        image: newImage.image,
      },
    });
  }

  async deleteUser(userId: string): Promise<void> {
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
