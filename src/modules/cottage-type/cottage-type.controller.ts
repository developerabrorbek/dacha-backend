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
import { CottageTypeService } from './cottage-type.service';
import { CottageType } from '@prisma/client';
import { UpdateCottageTypeDto, CreateCottageTypeDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cottage Type')
@Controller('cottage-type')
export class CottageTypeController {
  #_service: CottageTypeService;

  constructor(service: CottageTypeService) {
    this.#_service = service;
  }

  @Get()
  async getCottageTypeList(
    @Headers('accept-language') languageCode: string,
  ): Promise<CottageType[]> {
    return await this.#_service.getCottageTypeList(languageCode);
  }

  @Post('/add')
  async createCottageType(@Body() payload: CreateCottageTypeDto): Promise<void> {
    await this.#_service.createCottageType(payload);
  }

  @Patch('/edit/:id')
  async updateCottageType(
    @Param('id') cottageTypeId: string,
    @Body() paylaod: UpdateCottageTypeDto,
  ): Promise<void> {
    await this.#_service.updateCottageType({ id: cottageTypeId, name: paylaod.name });
  }

  @Delete("/delete/:id")
  async deleteCottageType(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottageType(id);
  }
}
