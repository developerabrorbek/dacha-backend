import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ComfortService } from './comfort.service';
import { Comfort } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateComfortDto, UpdateComfortDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags('Comfort')
@Controller('comfort')
export class ComfortController {
  #_service: ComfortService;

  constructor(service: ComfortService) {
    this.#_service = service;
  }
  
  @CheckAuth(false)
  @Permission(PERMISSIONS.comfort.get_all_comfort)
  @Get()
  async getComfortList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Comfort[]> {
    return await this.#_service.getComfortList(languageCode);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.create_comfort)
  @Post('/add')
  async createComfort(@Body() payload: CreateComfortDto): Promise<void> {
    await this.#_service.createComfort(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.edit_comfort)
  @Patch('/edit/:id')
  async updateComfort(
    @Param('id') comfortId: string,
    @Body() payload: UpdateComfortDto,
  ): Promise<void> {
    await this.#_service.updateComfort({ ...payload, id: comfortId });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.delete_comfort)
  @Delete('/delete/:id')
  async deleteComfort(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteComfort(id);
  }
}
