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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLanguageDto, UpdateLanguageDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

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

  @CheckAuth(true)
  @Permission(PERMISSIONS.language.create_language)
  @Post()
  async createLanguage(@Body() payload: CreateLanguageDto): Promise<void> {
    await this.#_service.createLanguage(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.language.edit_language)
  @Patch(':id')
  async updateLanguage(
    @Body() payload: UpdateLanguageDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.#_service.updateLanguage({ id, ...payload });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.language.delete_language)
  @Delete(':id')
  async deleteLanguage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteLanguage(id);
  }
}
