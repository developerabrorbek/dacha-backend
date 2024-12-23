import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymeService } from './payme.service';
import { CheckoutPaymentDto, CreatePaymentDto } from './dto';
import { PaymeError, PaymeMethod } from '@enums';
import { TransactionException } from '@exceptions';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymeGuard } from '@guard';
import { ConfigService } from '@nestjs/config';
import { encode } from 'base-64';
import { CheckAuth } from '@decorators';

@ApiTags('Payme')
@Controller('payme')
export class PaymeController {
  constructor(
    private readonly paymeService: PaymeService,
    private configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(PaymeGuard)
  @Post('pay')
  async pay(@Body() payload: CreatePaymentDto) {
    const { id, method, params } = payload;

    switch (method) {
      case PaymeMethod.CheckPerformTransaction: {
        await this.paymeService.checkPerformTransaction(params, id);
        return { result: { allow: true } };
      }
      case PaymeMethod.CheckTransaction: {
        const result = await this.paymeService.checkTransaction(params, id);
        return { result };
      }
      case PaymeMethod.CreateTransaction: {
        const result = await this.paymeService.createTransaction(params, id);
        return { result };
      }
      case PaymeMethod.PerformTransaction: {
        const result = await this.paymeService.performTransaction(params, id);
        return { result };
      }
      case PaymeMethod.CancelTransaction: {
        const result = await this.paymeService.cancelTransaction(params, id);
        return { result };
      }
      case PaymeMethod.GetStatement: {
        const result = await this.paymeService.getStatement(params);
        return { result: { transactions: result } };
      }
      default: {
        throw new TransactionException(PaymeError.MethodNotFound, id);
      }
    }
  }

  @ApiBearerAuth()
  @CheckAuth(true)
  @Post('checkout')
  async checkout(@Body() payload: CheckoutPaymentDto, @Req() request: any) {
    const currentUserId = request.userId;

    const MERCHANT_ID =
      this.configService.getOrThrow<string>('payme.merchantId');

    const user = await this.paymeService.checkUser(currentUserId);
    const order = await this.paymeService.checkOrder(payload.orderId);

    const amount = order.tariff.price * 100;

    const r = encode(
      `m=${MERCHANT_ID};ac.user_id=${user.id};ac.product_id=${order.id};a=${amount};c=${payload.url}`,
    );
    return { url: `https://checkout.paycom.uz/${r}` };
  }
}
