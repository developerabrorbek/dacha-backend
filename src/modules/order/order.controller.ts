import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Orders } from '@prisma/client';
import { CreateOrderDto, UpdateOrderDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth("JWT")
@ApiTags("Orders")
@Controller('order')
export class OrderController {
  #_service: OrderService;

  constructor(service: OrderService) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.order.get_all_users_orders_for_admin.name)
  @Get('/all/for/admin')
  async getAllOrdersForAdmin(
    @Headers('accept-language') languageCode: string,
  ): Promise<Orders[]> {
    return await this.#_service.getAllOrderForAdmin(languageCode);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.order.get_all_user_orders.name)
  @Get('/all/for/user')
  async getUserOrders(
    @Headers('accept-language') languageCode: string,
    @Req() req: any,
  ): Promise<Orders[]> {
    return await this.#_service.getAllUserOrder({
      languageCode,
      userId: req.userId,
    });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.order.create_order.name)
  @Post('/add')
  async createOrder(
    @Body() payload: CreateOrderDto,
    @Req() req: any,
  ): Promise<Orders> {
    return await this.#_service.createOrder({ ...payload, assignedBy: req.userId });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.order.update_order.name)
  @Patch('/update/:orderId')
  async updateOrder(
    @Body() payload: UpdateOrderDto,
    @Param('orderId') orderId: string,
  ): Promise<void> {
    await this.#_service.updateOrder({ ...payload, orderId });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.order.delete_order.name)
  @Delete('/delete/:orderId')
  async deleteOrder(@Param('orderId') orderId: string): Promise<void> {
    await this.#_service.deleteOrder(orderId);
  }
}
