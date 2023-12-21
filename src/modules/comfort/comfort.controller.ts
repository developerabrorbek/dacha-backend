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

@ApiTags('Comfort')
@Controller('comfort')
export class ComfortController {
  #_service: ComfortService;

  constructor(service: ComfortService) {
    this.#_service = service;
  }

  @Get()
  async getComfortList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Comfort[]> {
    return await this.#_service.getComfortList(languageCode);
  }

  @Post('/add')
  async createComfort(@Body() payload: CreateComfortDto): Promise<void> {
    await this.#_service.createComfort(payload);
  }

  @Patch('/edit/:id')
  async updateComfort(
    @Param('id') comfortId: string,
    @Body() payload: UpdateComfortDto,
  ): Promise<void> {
    await this.#_service.updateComfort({ ...payload, id: comfortId });
  }

  @Delete('/delete/:id')
  async deleteComfort(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteComfort(id);
  }
}
