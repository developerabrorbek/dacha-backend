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
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags('Place')
@Controller('place')
export class PlaceController {
  #_service: PlaceService;

  constructor(service: PlaceService) {
    this.#_service = service;
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.place.get_all_place)
  @Get()
  async getPlaceList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Place[]> {
    return await this.#_service.getPlaceList(languageCode);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.place.create_place)
  @Post('/add')
  async createPlace(@Body() payload: CreatePlaceDto): Promise<void> {
    await this.#_service.createPlace(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.place.edit_place)
  @Patch('/edit/:id')
  async updatePlace(
    @Param('id') placeId: string,
    @Body() paylaod: UpdatePlaceDto,
  ): Promise<void> {
    await this.#_service.updatePlace({ id: placeId, name: paylaod.name, image: paylaod.image });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.place.delete_place)
  @Delete('/delete/:id')
  async deletePlace(@Param('id') id: string): Promise<void> {
    await this.#_service.deletePlace(id);
  }
}
