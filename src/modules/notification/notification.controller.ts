import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '@prisma/client';
import { CreateNotificationDto, UpdateNotificationDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags("Notification")
@Controller('notification')
export class NotificationController {
  #_service: NotificationService;

  constructor(service: NotificationService) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.get_all_notification)
  @Get('all')
  async getNotificationList(
  ): Promise<Notification[]> {
    return await this.#_service.getAllNotifications();
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.notification.get_user_notification)
  @Get(':id')
  async getUserNotificationList(
    @Param('id') userId: string,
  ): Promise<Notification[]> {
    return await this.#_service.getNotificationList({ userId });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.create_notification)
  @Post("add")
  async createNotification(
    @Body() payload: CreateNotificationDto,
    @Req() request: any,
  ): Promise<void> {
    await this.#_service.createNotification({
      ...payload,
      createdBy: request.userId,
    });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.edit_notification)
  @Patch("/update/:id")
  async updateNotification(@Body() payload: UpdateNotificationDto,@Param("id") id: string, @Req() request: any,): Promise<void>{
    await this.#_service.updateNotification({userId: request.userId, id, ...payload})
  }


  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.delete_notification)
  @Delete("/delete/:id")
  async deleteNotification(@Param("id") id: string): Promise<void> {
    await this.#_service.deleteNotification(id)
  }
}
