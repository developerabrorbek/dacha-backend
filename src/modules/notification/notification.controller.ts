import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '@prisma/client';
import { CreateNotificationDto, UpdateNotificationDto } from './dtos';
import { ApiBody, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags("Notification")
@Controller('notification')
export class NotificationController {
  #_service: NotificationService;

  constructor(service: NotificationService) {
    this.#_service = service;
  }

  @Get(':id')
  async getNotificationList(
    @Param('id') userId: string,
  ): Promise<Notification[]> {
    return await this.#_service.getNotificationList({ userId });
  }

  @ApiHeader({
    name: "access-token",
  })
  @ApiBody({
    type: CreateNotificationDto,
  })
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

  @ApiHeader({
    name: "access-token",
  })
  @ApiParam({
    name: "id"
  })
  @ApiBody({
    type: UpdateNotificationDto,
  })
  @Patch("/update/:id")
  async updateNotification(@Body() payload: UpdateNotificationDto,@Param("id") id: string, @Headers('access-token') accessToken: string): Promise<void>{
    await this.#_service.updateNotification({userId: accessToken, id, ...payload})
  }

  @ApiParam({
    name: "id"
  })
  @Delete("/delete/:id")
  async deleteNotification(@Param("id") id: string): Promise<void> {
    await this.#_service.deleteNotification(id)
  }
}
