import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  // CreateNotificationRequest,
} from './interfaces';
import { Region } from '@prisma/client';

@Injectable()
export class NotificationService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  // async createNotification(payload: CreateNotificationRequest): Promise<void> {
  //   await this.#_prisma.notification.create({
  //     data: {
  //       message: payload.message,
  //       userId: payload.userId,
  //       status: payload.status,
  //       type: payload.type,
  //       created_by: payload.createdBy,
  //     },
  //   });
  // }

  async getRegionList(): Promise<Region[]> {
    const data = await this.#_prisma.region.findMany();

    return data;
  }

  async updateRegion(payload): Promise<void> {
    await this.#_prisma.region.update({
      where: { id: payload.id },
      data: { name: payload.name },
    });
  }

  async deleteRegion(id: string): Promise<void> {
    await this.#_prisma.region.delete({ where: { id } });
  }
}
