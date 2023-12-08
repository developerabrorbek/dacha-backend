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
import { CottageService } from './cottage.service';
import { Cottage } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateCottageDto,
  UpdateCottageDto,
  UpdateCottageImageDto,
} from './dtos';

@ApiTags('Cottage')
@Controller('cottage')
export class CottageController {
  #_service: CottageService;

  constructor(service: CottageService) {
    this.#_service = service;
  }

  @Get()
  async getCottageList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Cottage[]> {
    return await this.#_service.getCottageList(languageCode);
  }

  @Post('/add')
  async createCottage(@Body() payload: CreateCottageDto): Promise<void> {
    await this.#_service.createCottage(payload);
  }

  @Patch('/edit/:id')
  async updateCottage(
    @Param('id') cottageId: string,
    @Body() payload: UpdateCottageDto,
  ): Promise<void> {
    await this.#_service.updateCottage({ id: cottageId, ...payload });
  }

  @Delete('/delete/:id')
  async deleteCottage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottage(id);
  }

  @Patch('/image/:id')
  async updateCottageImage(
    @Param('id') id: string,
    @Body() payload: UpdateCottageImageDto,
  ): Promise<void> {
    await this.#_service.updateCottageImage({ id, ...payload });
  }

  @Delete('/image/:id')
  async deleteCottageImage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottageImage(id);
  }
}
