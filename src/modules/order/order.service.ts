import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TranslateService } from '@modules';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderRequest, UpdateOrderRequest } from './interfaces';
import { Orders } from '@prisma/client';
import { isUUID } from 'class-validator';
import { GetAllUserOrderRequest } from './interfaces/get-all-user-order.interfaces';

@Injectable()
export class OrderService {
  #_prisma: PrismaService;
  #_translate: TranslateService;

  constructor(prisma: PrismaService, translate: TranslateService) {
    this.#_prisma = prisma;
    this.#_translate = translate;
  }

  async createOrder(payload: CreateOrderRequest): Promise<void> {
    // check user if exists
    await this.#_checkUser(payload.assignedBy);

    // check cottage if exists
    await this.#_checkCottage(payload.cottageId);

    const foundedTariff = await this.#_prisma.tariff.findFirst({
      where: { id: payload.tariffId },
      include: {
        service: true,
      },
    });

    if (!foundedTariff) throw new NotFoundException('Tariff not found');

    // set expire date to order
    const date = new Date();
    date.setDate(date.getDate() + foundedTariff.days);

    // set cottages to premium cottages after order
    // await this.#_prisma.premium_Cottage.create({
    //   data: {
    //     expireAt: date,
    //     serviceCode: foundedTariff.service.serviceCode,
    //     cottageId: payload.cottageId,
    //     priority: payload?.priority,
    //   },
    // });

    await this.#_prisma.orders.create({
      data: {
        userId: payload.assignedBy,
        expireAt: date,
        cottageId: payload.cottageId,
        tariffId: payload.tariffId,
      },
    });
  }

  async getAllOrderForAdmin(languageCode: string): Promise<Orders[]> {
    const data = await this.#_prisma.orders.findMany({
      include: {
        cottage: true,
        tariff: true,
        user: true,
      },
    });

    for (const el of data) {
      const tariff = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.tariff.description,
      });
      el.tariff.description = tariff.value;

      const tariffType = await this.#_translate.getSingleTranslate({
        languageCode,
        translateId: el.tariff.type,
      });
      el.tariff.type = tariffType.value;
    }

    return data;
  }

  async getAllUserOrder(payload: GetAllUserOrderRequest): Promise<Orders[]> {
    const data = await this.#_prisma.orders.findMany({
      where: {
        userId: payload.userId,
      },
      include: {
        cottage: true,
        tariff: true,
        user: true,
      },
    });

    for (const el of data) {
      const tariff = await this.#_translate.getSingleTranslate({
        languageCode: payload.languageCode,
        translateId: el.tariff.description,
      });
      el.tariff.description = tariff.value;

      const tariffType = await this.#_translate.getSingleTranslate({
        languageCode: payload.languageCode,
        translateId: el.tariff.type,
      });
      el.tariff.type = tariffType.value;
    }

    return data;
  }

  async updateOrder(payload: UpdateOrderRequest): Promise<void> {
    // Checking ID
    this.#_checkUUID(payload.orderId);

    const foundedOrder = await this.#_prisma.orders.findFirst({
      where: { id: payload.orderId },
    });

    if (!foundedOrder) {
      throw new NotFoundException('Order not found');
    }

    await this.#_prisma.orders.update({
      where: { id: payload.orderId },
      data: {
        status: payload.status || foundedOrder.status,
        orderStatus: payload.orderStatus || foundedOrder.orderStatus,
      },
    });
  }

  async deleteOrder(id: string): Promise<void> {
    // Checking ID
    this.#_checkUUID(id);

    const foundedOrder = await this.#_prisma.orders.findFirst({
      where: { id: id },
    });

    if (!foundedOrder) {
      return;
    }

    await this.#_prisma.orders.delete({ where: { id } });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4))
      throw new ConflictException('Please provide a valid UUID');
  }

  async #_checkCottage(id: string): Promise<void> {
    const cottage = await this.#_prisma.cottage.findFirst({
      where: { id: id },
    });

    if (!cottage) {
      throw new NotFoundException('Cottage not found');
    }
  }

  async #_checkUser(id: string): Promise<void> {
    const user = await this.#_prisma.user.findFirst({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
