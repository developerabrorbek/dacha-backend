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
import { RegionService } from './region.service';
import { Region } from '@prisma/client';
import { CreateRegionDto, UpdateRegionDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  #_service: RegionService;

  constructor(service: RegionService) {
    this.#_service = service;
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.region.get_all_region)
  @Get()
  async getRegionList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Region[]> {
    return await this.#_service.getRegionList(languageCode);
  }

  @ApiBearerAuth("JWT")
  @CheckAuth(true)
  @Permission(PERMISSIONS.region.create_region)
  @Post('/add')
  async createRegion(@Body() payload: CreateRegionDto): Promise<void> {
    await this.#_service.createRegion(payload);
  }

  @ApiBearerAuth("JWT")
  @CheckAuth(true)
  @Permission(PERMISSIONS.region.edit_region)
  @Patch('/edit/:id')
  async updateRegion(
    @Param('id') regionId: string,
    @Body() paylaod: UpdateRegionDto,
  ): Promise<void> {
    await this.#_service.updateRegion({ id: regionId, name: paylaod.name });
  }

  @ApiBearerAuth("JWT")
  @CheckAuth(true)
  @Permission(PERMISSIONS.region.delete_region)
  @Delete("/delete/:id")
  async deleteRegion(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteRegion(id);
  }
}
