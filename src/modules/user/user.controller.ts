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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDevice } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@ApiBearerAuth()
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
  @Get('/single')
  async getSingleUser(@Req() req: any): Promise<any> {
    return await this.#_service.getSingleUser(req.userId);
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Patch('/edit/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() payload: UpdateUserDto,
    @Req() req: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateUser({
      id: userId,
      ...payload,
      image,
    }, req.userId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.user.delete_user)
  @Delete('/delete/:id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.#_service.deleteUser(userId);
  }
}
