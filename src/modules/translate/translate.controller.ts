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
import { ApiTags } from '@nestjs/swagger';
import { CreateTranslateDto, UpdateTranslateDto } from './dtos';
import { Translate } from '@prisma/client';
import { GetSingleTranslateResponse } from './interfaces';

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

  @Get()
  async getTranslateList(): Promise<Translate[]> {
    return await this.#_service.getTranslateList();
  }

  @Get("/unused")
  async getUnusedTranslateList(): Promise<Translate[]> {
    return await this.#_service.getUnusedTranslateList();
  }

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

  @Post()
  async createTranslate(@Body() payload: CreateTranslateDto): Promise<void> {
    await this.#_service.createTranslate(payload);
  }

  @Patch(':id')
  async updateTranslate(
    @Param('id') translateId: string,
    @Body() payload: UpdateTranslateDto,
  ): Promise<void> {
    await this.#_service.updateTranslate({ ...payload, id: translateId });
  }

  @Delete(':id')
  async deleteTranslate(@Param('id') translateId: string): Promise<void> {
    await this.#_service.deleteTranslate(translateId);
  }
}
