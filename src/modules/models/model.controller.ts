import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Modelservice } from './model.service';
import { Models } from '@prisma/client';
import { CreateModelDto, UpdateModelDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiBearerAuth("JWT")
@ApiTags('Models')
@Controller('models')
export class ModelsController {
  #_service: Modelservice;

  constructor(service: Modelservice) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.models.get_all_models.name)
  @Get()
  async getModelsList(): Promise<Models[]> {
    return await this.#_service.getModelsList();
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.models.create_models.name)
  @Post('/add')
  async createModel(@Body() payload: CreateModelDto): Promise<void> {
    await this.#_service.createModel(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.models.edit_models.name)
  @Patch('/edit/:id')
  async updateModel(
    @Param('id') modelId: string,
    @Body() paylaod: UpdateModelDto,
  ): Promise<void> {
    await this.#_service.updateModel({ id: modelId, name: paylaod.name });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.models.delete_models.name)
  @Delete('/delete/:id')
  async deleteModel(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteModel(id);
  }
}
