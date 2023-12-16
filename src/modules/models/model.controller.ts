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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
  #_service: Modelservice;

  constructor(service: Modelservice) {
    this.#_service = service;
  }

  @Get()
  async getModelsList(): Promise<Models[]> {
    return await this.#_service.getModelsList();
  }

  @Post('/add')
  async createModel(@Body() payload: CreateModelDto): Promise<void> {
    await this.#_service.createModel(payload);
  }

  @Patch('/edit/:id')
  async updateModel(
    @Param('id') modelId: string,
    @Body() paylaod: UpdateModelDto,
  ): Promise<void> {
    await this.#_service.updateModel({ id: modelId, name: paylaod.name });
  }

  @Delete('/delete/:id')
  async deleteModel(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteModel(id);
  }
}
