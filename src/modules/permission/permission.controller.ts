import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as types from '@prisma/client';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { Permissionservice } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dtos';

@ApiBearerAuth("JWT")
@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  #_service: Permissionservice;

  constructor(service: Permissionservice) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.permission.get_all_permission)
  @Get()
  async getPermissionList(): Promise<types.Permission[]> {
    return await this.#_service.getPermissionList();
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.permission.create_permission)
  @Post('/add')
  async createPermission(@Body() payload: CreatePermissionDto): Promise<void> {
    await this.#_service.createPermission(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.permission.edit_permission)
  @Patch('/edit/:id')
  async updatePermission(
    @Param('id') permissionId: string,
    @Body() payload: UpdatePermissionDto,
  ): Promise<void> {
    await this.#_service.updatePermission({
      id: permissionId,
      name: payload.name,
    });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.permission.delete_permission)
  @Delete('/delete/:id')
  async deletePermission(@Param('id') id: string): Promise<void> {
    await this.#_service.deletePermission(id);
  }
}
