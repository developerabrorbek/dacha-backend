import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { Place } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePlaceDto, UpdatePlaceDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @ApiBearerAuth()
  @CheckAuth(true)
  @Permission(PERMISSIONS.place.create_place)
  @Post('/add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createPlace(
    @Body() payload: CreatePlaceDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.createPlace({ ...payload, image });
  }

  @ApiBearerAuth()
  @CheckAuth(true)
  @Permission(PERMISSIONS.place.edit_place)
  @Patch('/edit/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updatePlace(
    @Param('id') placeId: string,
    @Body() paylaod: UpdatePlaceDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updatePlace({
      id: placeId,
      name: paylaod?.name,
      image,
    });
  }

  @ApiBearerAuth()
  @CheckAuth(true)
  @Permission(PERMISSIONS.place.delete_place)
  @Delete('/delete/:id')
  async deletePlace(@Param('id') id: string): Promise<void> {
    await this.#_service.deletePlace(id);
  }
}
