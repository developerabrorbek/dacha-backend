import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDevice } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags('User')
@Controller('user')
export class UserController {
  #_service: UserService;

  constructor(service: UserService) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.get_all_users)
  @Get('/all')
  async getUserList(): Promise<any[]> {
    return await this.#_service.getUserList();
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.get_all_user_device)
  @Get('/user-device/:userId')
  async getUserDevices(@Param('userId') userId: string): Promise<UserDevice[]> {
    return await this.#_service.getUserDevices(userId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.create_users)
  @Post('add')
  async createUser(@Body() payload: CreateUserDto, @Req() req: any): Promise<void> {
    await this.#_service.createUser(payload, req.userId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.edit_user)
  @Patch('/edit/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() payload: UpdateUserDto,
    @Req() req: any
  ): Promise<void> {
    await this.#_service.updateUser({
      id: userId,
      ...payload,
    }, req.userId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.delete_user)
  @Delete('/delete/:id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.#_service.deleteUser(userId);
  }
}
