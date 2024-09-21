import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '@prisma/client';
import {
  CreateNotificationDto,
  CreateNotificationForAllDto,
  UpdateNotificationDto,
} from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  #_service: NotificationService;

  constructor(service: NotificationService) {
    this.#_service = service;
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.get_all_notification.name)
  @Get('all')
  async getNotificationList(): Promise<Notification[]> {
    return await this.#_service.getAllNotifications();
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.notification.get_user_notification.name)
  @Get('by/:userId')
  async getUserNotificationList(
    @Param('userId') userId: string,
  ): Promise<Notification[]> {
    return await this.#_service.getNotificationList({ userId });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.create_notification.name)
  @Post('add/for/single')
  async createNotification(
    @Body() payload: CreateNotificationDto,
  ): Promise<void> {
    await this.#_service.createNotificationForSingle({
      ...payload,
    });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.create_notification_for_all.name)
  @Post('add/for/all')
  async createNotificationForAll(
    @Body() payload: CreateNotificationForAllDto,
  ): Promise<void> {
    await this.#_service.createNotificationForAll({
      ...payload,
    });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.edit_notification.name)
  @Patch('/update/:id')
  async updateNotification(
    @Body() payload: UpdateNotificationDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.#_service.updateNotification({
      ...payload,
      notificationId: id,
    });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.notification.delete_notification.name)
  @Delete('/delete/:id')
  async deleteNotification(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteNotification(id);
  }
}
