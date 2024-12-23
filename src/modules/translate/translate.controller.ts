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
import { TranslateService } from './translate.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTranslateDto, UpdateTranslateDto } from './dtos';
import { Translate } from '@prisma/client';
import {
  GetSingleTranslateByTranslateCodeResponse,
  GetSingleTranslateResponse,
} from './interfaces';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiBearerAuth('JWT')
@ApiTags('Translate')
@Controller({
  path: 'translate',
  version: '1.0',
})
export class TranslateController {
  #_service: TranslateService;

  constructor(service: TranslateService) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.translate.get_all_translate.name)
  @Get()
  async getTranslateList(): Promise<Translate[]> {
    return await this.#_service.getTranslateList();
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.translate.get_unused_translate.name)
  @Get('/unused')
  async getUnusedTranslateList(): Promise<Translate[]> {
    return await this.#_service.getUnusedTranslateList();
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.translate.get_translate.name)
  @Get(':id')
  async retrieveSingleTranslate(
    @Headers('accept-language') languageCode: string,
    @Param('id') translateId: string,
  ): Promise<GetSingleTranslateResponse> {
    return await this.#_service.getSingleTranslate({
      languageCode,
      translateId,
    });
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.translate.get_single_translate_by_code.name)
  @Get('single/by/:translateCode')
  async retrieveSingleTranslateByCode(
    @Headers('accept-language') languageCode: string,
    @Param('translateCode') translateCode: string,
  ): Promise<GetSingleTranslateByTranslateCodeResponse> {
    return await this.#_service.getSingleTranslateByTranslateCode({
      languageCode,
      translateCode,
    });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.translate.create_translate.name)
  @Post()
  async createTranslate(@Body() payload: CreateTranslateDto): Promise<void> {
    await this.#_service.createTranslate(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.translate.edit_translate.name)
  @Patch(':id')
  async updateTranslate(
    @Param('id') translateId: string,
    @Body() payload: UpdateTranslateDto,
  ): Promise<void> {
    await this.#_service.updateTranslate({ ...payload, id: translateId });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.translate.delete_translate.name)
  @Delete(':id')
  async deleteTranslate(@Param('id') translateId: string): Promise<void> {
    await this.#_service.deleteTranslate(translateId);
  }
}
