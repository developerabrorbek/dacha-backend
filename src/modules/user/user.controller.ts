import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserDevice } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MulterConfig } from '@config';

@ApiBearerAuth('JWT')
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
  @Permission(PERMISSIONS.user.get_single_user)
  @Get('/me')
  async getSingleUser(@Req() req: any): Promise<any> {
    return await this.#_service.getSingleUser(req?.userId);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.user.get_single_user_by_userid)
  @Get('/:userId')
  async getSingleUserByUserID(@Param('userId') userId: string): Promise<User> {
    return await this.#_service.getSingleUserByUserID(userId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.get_all_user_device)
  @Get('/:userId/user-devices')
  async getUserDevices(@Param('userId') userId: string): Promise<UserDevice[]> {
    return await this.#_service.getUserDevices(userId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.create_users)
  @Post('add')
  async createUser(@Body() payload: CreateUserDto): Promise<void> {
    await this.#_service.createUser(payload);
  }

  @ApiConsumes('multipart/form-data')
  @CheckAuth(true)
  @Permission(PERMISSIONS.user.edit_user)
  @UseInterceptors(FileInterceptor('image', MulterConfig()))
  @Patch('/edit/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() payload: UpdateUserDto,
    @Req() req: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateUser(
      {
        id: userId,
        ...payload,
        image,
      },
      req.userId,
    );
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.delete_user)
  @Delete('/delete/:id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.#_service.deleteUser(userId);
  }
}
