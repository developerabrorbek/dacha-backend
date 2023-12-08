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
import { PlaceService } from './place.service';
import { Place } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlaceDto, UpdatePlaceDto } from './dtos';

@ApiTags('Place')
@Controller('place')
export class PlaceController {
  #_service: PlaceService;

  constructor(service: PlaceService) {
    this.#_service = service;
  }

  @Get()
  async getPlaceList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Place[]> {
    return await this.#_service.getPlaceList(languageCode);
  }

  @Post('/add')
  async createPlace(@Body() payload: CreatePlaceDto): Promise<void> {
    await this.#_service.createPlace(payload);
  }

  @Patch('/edit/:id')
  async updatePlace(
    @Param('id') placeId: string,
    @Body() paylaod: UpdatePlaceDto,
  ): Promise<void> {
    await this.#_service.updatePlace({ id: placeId, name: paylaod.name });
  }

  @Delete('/delete/:id')
  async deletePlace(@Param('id') id: string): Promise<void> {
    await this.#_service.deletePlace(id);
  }
}
