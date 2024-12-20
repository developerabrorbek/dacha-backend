import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionException } from '@exceptions';
import { PaymeData, PaymeError, TransactionState } from '@enums';
import { isUUID } from 'class-validator';
import { PrismaService } from '@prisma';

@Injectable()
export class PaymeService {
  constructor(private prisma: PrismaService) {}
  async checkPerformTransaction(params: any, id: number) {
    let { account, amount } = params;

    if (!isUUID(account.user_id, '4')) {
      throw new TransactionException(
        PaymeError.UserNotFound,
        id,
        PaymeData.UserId,
      );
    }
    if (!isUUID(account.order_id, '4')) {
      throw new TransactionException(
        PaymeError.OrderNotFound,
        id,
        PaymeData.OrderId,
      );
    }

    amount = Math.floor(amount / 100);
    const user = await this.prisma.user.findFirst({
      where: { id: account.user_id },
    });

    if (!user) {
      throw new TransactionException(
        PaymeError.UserNotFound,
        id,
        PaymeData.UserId,
      );
    }

    const order = await this.prisma.orders.findFirst({
      where: { id: account.order_id },
      include: { tariff: true },
    });

    if (!order) {
      throw new TransactionException(
        PaymeError.OrderNotFound,
        id,
        PaymeData.OrderId,
      );
    }
    

    if (amount !== order.tariff.price) {
      throw new TransactionException(PaymeError.InvalidAmount, id);
    }
  }

  async checkTransaction(params: any, id: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: params.id },
    });

    if (!transaction) {
      throw new TransactionException(PaymeError.TransactionNotFound, id);
    }

    return {
      create_time: Number(transaction.createTime),
      perform_time: Number(transaction.performTime),
      cancel_time: Number(transaction.cancelTime),
      transaction: transaction.id,
      state: transaction.state,
      reason: transaction.reason,
    };
  }

  async createTransaction(params: any, id: number) {
    let { amount, time, account } = params;

    amount = Math.floor(amount / 100);

    await this.checkPerformTransaction(params, id);

    let transaction = await this.prisma.transaction.findFirst({
      where: { id: params.id },
    });

    if (transaction) {
      if (transaction.state !== TransactionState.Pending) {
        throw new TransactionException(PaymeError.CantDoOperation, id);
      }
      const currentTime = Date.now();
      const expirationTime =
        (BigInt(currentTime) - transaction.createTime) / BigInt(60000) < 12;
      if (!expirationTime) {
        await this.prisma.transaction.update({
          where: { id: params.id },
          data: { state: TransactionState.PendingCanceled, reason: 4 },
        });
        throw new TransactionException(PaymeError.CantDoOperation, id);
      }
      return {
        create_time: Number(transaction.createTime),
        transaction: transaction.id,
        state: TransactionState.Pending,
      };
    }

    transaction = await this.prisma.transaction.findFirst({
      where: {
        userId: account.user_id,
        orderId: account.order_id,
        provider: 'payme',
      },
    });
    if (transaction) {
      if (transaction.state === TransactionState.Paid)
        throw new TransactionException(PaymeError.AlreadyDone, id);
      if (transaction.state === TransactionState.Pending)
        throw new TransactionException(PaymeError.Pending, id);
    }

    const newTransaction = await this.prisma.transaction.create({
      data: {
        id: params.id,
        state: TransactionState.Pending,
        amount,
        userId: account.user_id,
        orderId: account.order_id,
        createTime: time,
        provider: 'payme',
      },
    });

    return {
      create_time: Number(newTransaction.createTime),
      transaction: newTransaction.id,
      state: TransactionState.Pending,
    };
  }

  async performTransaction(params: any, id: number) {
    const currentTime = Date.now();

    const transaction = await this.prisma.transaction.findFirst({
      where: { id: params.id },
      include: {
        order: { include: { tariff: { include: { service: true } } } },
      },
    });

    if (!transaction) {
      throw new TransactionException(PaymeError.TransactionNotFound, id);
    }

    if (transaction.state !== TransactionState.Pending) {
      if (transaction.state !== TransactionState.Paid) {
        throw new TransactionException(PaymeError.CantDoOperation, id);
      }
      return {
        perform_time: Number(transaction.performTime),
        transaction: transaction.id,
        state: TransactionState.Paid,
      };
    }

    const expirationTime = (BigInt(currentTime) - transaction.createTime) / BigInt(60000) < 12;
    if (!expirationTime) {
      await this.prisma.transaction.update({
        where: { id: params.id },
        data: {
          state: TransactionState.PendingCanceled,
          reason: 4,
          cancelTime: currentTime,
        },
      });
      throw new TransactionException(PaymeError.CantDoOperation, id);
    }

    await this.prisma.transaction.update({
      where: { id: params.id },
      data: { state: TransactionState.Paid, performTime: currentTime },
    });

    // set expire date to order
    const date = new Date();
    date.setDate(date.getDate() + transaction.order.tariff.days);

    // set cottages to premium cottages after order
    await this.prisma.premium_Cottage.create({
      data: {
        expireAt: date,
        serviceCode: transaction.order.tariff.service.serviceCode,
        cottageId: transaction.order.cottageId,
      },
    });

    await this.prisma.orders.update({
      where: { id: transaction.orderId },
      data: { orderStatus: 'success', status: "active" },
    });

    return {
      perform_time: currentTime,
      transaction: transaction.id,
      state: TransactionState.Paid,
    };
  }

  async cancelTransaction(params: any, id: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: params.id },
    });

    if (!transaction) {
      throw new TransactionException(PaymeError.TransactionNotFound, id);
    }

    const currentTime = Date.now();

    if (transaction.state > 0) {
      await this.prisma.transaction.update({
        where: { id: params.id },
        data: {
          state: -Math.abs(transaction.state),
          reason: params.reason,
          cancelTime: currentTime,
        },
      });
    }

    return {
      cancel_time: Number(transaction.cancelTime) || currentTime,
      transaction: transaction.id,
      state: -Math.abs(transaction.state),
    };
  }

  async getStatement(params: any) {
    const { from, to } = params;
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createTime: {
          gte: from,
          lte: to,
        },
        provider: 'payme',
      },
    });

    const response = transactions.map((transaction) => ({
      id: transaction.id,
      time: Number(transaction.createTime),
      amount: transaction.amount,
      account: {
        user_id: transaction.userId,
        order_id: transaction.orderId,
      },
      create_time: Number(transaction.createTime),
      perform_time: Number(transaction.performTime),
      cancel_time: Number(transaction.cancelTime),
      transaction: transaction.id,
      state: transaction.state,
      reason: transaction.reason,
    }));

    return response
  }

  async checkUser(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(PaymeError.UserNotFound);
    }
    return user;
  }

  async checkOrder(id: string) {
    const order = await this.prisma.orders.findFirst({
      where: { id },
      include: { tariff: true },
    });
    if (!order) {
      throw new NotFoundException(PaymeError.OrderNotFound);
    }
    return order;
  }
}
