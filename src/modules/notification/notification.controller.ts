import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
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

  @CheckAuth(false)
  @Permission(PERMISSIONS.notification.get_all_notification)
  @Get(':id')
  async getNotificationList(
    @Param('id') userId: string,
  ): Promise<Notification[]> {
    return await this.#_service.getNotificationList({ userId });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.create_notification)
  @Post("add")
  async createNotification(
    @Body() payload: CreateNotificationDto,
    @Headers('access-token') accessToken: string,
  ): Promise<void> {
    await this.#_service.createNotification({
      ...payload,
      createdBy: accessToken,
    });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.edit_notification)
  @Patch("/update/:id")
  async updateNotification(@Body() payload: UpdateNotificationDto,@Param("id") id: string, @Headers('access-token') accessToken: string): Promise<void>{
    await this.#_service.updateNotification({userId: accessToken, id, ...payload})
  }


  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.delete_notification)
  @Delete("/delete/:id")
  async deleteNotification(@Param("id") id: string): Promise<void> {
    await this.#_service.deleteNotification(id)
  }
}
