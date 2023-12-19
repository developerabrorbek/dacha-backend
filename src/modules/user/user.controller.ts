import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserDevice } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos';

@ApiTags('User')
@Controller('user')
export class UserController {
  #_service: UserService;

  constructor(service: UserService) {
    this.#_service = service;
  }

  @Get('/all')
  async getUserList(): Promise<User[]> {
    return await this.#_service.getUserList();
  }

  @Get('/user-device/:userId')
  async getUserDevices(@Param('userId') userId: string): Promise<UserDevice[]> {
    return await this.#_service.getUserDevices(userId);
  }

  @Post('add')
  async createUser(@Body() payload: CreateUserDto): Promise<void> {
    await this.#_service.createUser(payload);
  }

  @Patch('/edit/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() payload: UpdateUserDto,
  ): Promise<void> {
    await this.#_service.updateUser({
      id: userId,
      ...payload,
    });
  }

  @Delete('/delete/:id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.#_service.deleteUser(userId);
  }
}
