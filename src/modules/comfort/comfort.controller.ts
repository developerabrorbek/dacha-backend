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
import { ComfortService } from './comfort.service';
import { Comfort } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateComfortDto, UpdateComfortDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Express } from "express"
import { diskStorage } from 'multer';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (_, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createComfort(
    @Body() payload: CreateComfortDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.createComfort({ ...payload, image });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.edit_comfort)
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
  async updateComfort(
    @Param('id') comfortId: string,
    @Body() payload: UpdateComfortDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateComfort({ ...payload, id: comfortId, image });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.delete_comfort)
  @Delete('/delete/:id')
  async deleteComfort(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteComfort(id);
  }
}
