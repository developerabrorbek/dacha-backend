import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Permissionservice } from './permission.service';
import { Permission } from '@prisma/client';
import { CreatePermissionDto, UpdatePermissionDto } from './dtos';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  #_service: Permissionservice;

  constructor(service: Permissionservice) {
    this.#_service = service;
  }

  @Get()
  async getPermissionList(): Promise<Permission[]> {
    return await this.#_service.getPermissionList();
  }

  @Post('/add')
  async createPermission(@Body() payload: CreatePermissionDto): Promise<void> {
    await this.#_service.createPermission(payload);
  }

  @ApiBody({
    type: UpdatePermissionDto,
  })
  @Patch('/edit/:id')
  async updatePermission(
    @Param('id') permissionId: string,
    @Body() payload: UpdatePermissionDto,
  ): Promise<void> {
    await this.#_service.updatePermission({ id: permissionId, name: payload.name });
  }

  @Delete('/delete/:id')
  async deletePermission(@Param('id') id: string): Promise<void> {
    await this.#_service.deletePermission(id);
  }
}
