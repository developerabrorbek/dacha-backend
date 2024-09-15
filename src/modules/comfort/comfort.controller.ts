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
import { Express } from 'express';
import { MulterConfig } from '@config';
import { Comfort } from '@prisma/client';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ComfortService } from './comfort.service';
import {
  CreateComfortDto,
  UpdateComfortDto,
  UpdateComfortImageDto,
} from './dtos';
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

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.create_comfort)
  @Post('/add')
  @UseInterceptors(FileInterceptor('image', MulterConfig()))
  async createComfort(
    @Body() payload: CreateComfortDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.createComfort({ ...payload, image });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.edit_comfort)
  @Patch('/edit/:id')
  async updateComfort(
    @Param('id') comfortId: string,
    @Body() payload: UpdateComfortDto,
  ): Promise<void> {
    await this.#_service.updateComfort({ ...payload, id: comfortId });
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.edit_comfort_image)
  @UseInterceptors(FileInterceptor('image', MulterConfig()))
  @Patch('/edit/image/:comfortId')
  async updateComfortImage(
    @Param('comfortId') comfortId: string,
    @Body() payload: UpdateComfortImageDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateComfortImage({ ...payload, id: comfortId, image });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.comfort.delete_comfort)
  @Delete('/delete/:id')
  async deleteComfort(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteComfort(id);
  }
}
