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
import { RegionService } from './model.service';
import { Region } from '@prisma/client';
import { CreateRegionDto, UpdateRegionDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  #_service: RegionService;

  constructor(service: RegionService) {
    this.#_service = service;
  }

  @Get()
  async getRegionList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Region[]> {
    return await this.#_service.getRegionList(languageCode);
  }

  @Post('/add')
  async createRegion(@Body() payload: CreateRegionDto): Promise<void> {
    await this.#_service.createRegion(payload);
  }

  @Patch('/edit/:id')
  async updateRegion(
    @Param('id') regionId: string,
    @Body() paylaod: UpdateRegionDto,
  ): Promise<void> {
    await this.#_service.updateRegion({ id: regionId, name: paylaod.name });
  }

  @Delete("/delete/:id")
  async deleteRegion(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteRegion(id);
  }
}
