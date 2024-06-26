import { Language } from '@prisma/client';
import { LanguageService } from './language.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  CreateLanguageDto,
  UpdateLanguageDto,
  UpdateLanguageImageDto,
} from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Language')
@Controller({
  path: 'language',
  version: '1.0',
})
export class LanguageController {
  #_service: LanguageService;

  constructor(service: LanguageService) {
    this.#_service = service;
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.language.get_all_language)
  @Get()
  async getLanguageList(): Promise<Language[]> {
    return await this.#_service.getLanguageList();
  }

  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.language.create_language)
  @Post()
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
  async createLanguage(
    @Body() payload: CreateLanguageDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.createLanguage({ ...payload, image });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.language.edit_language)
  @Patch(':id')
  async updateLanguage(
    @Body() payload: UpdateLanguageDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.#_service.updateLanguage({ id, ...payload });
  }

  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.language.edit_language_image)
  @Patch('/update/image/:languageId')
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
  async updateLanguageImage(
    @Body() payload: UpdateLanguageImageDto,
    @Param('languageId') languageId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateLanguageImage({ languageId, image });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.language.delete_language)
  @Delete(':id')
  async deleteLanguage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteLanguage(id);
  }
}
