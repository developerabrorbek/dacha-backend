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
import { ApiTags } from '@nestjs/swagger';
import {
  AddCottageImageDto,
  CreateCottageDto,
  UpdateCottageDto,
  UpdateCottageImageDto,
} from './dtos';
import { GetCottageListResponse } from './interfaces';

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
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageList(languageCode);
  }

  @Post('/add')
  async createCottage(@Body() payload: CreateCottageDto): Promise<void> {
    await this.#_service.createCottage({ ...payload, createdBy: 'kimdir' });
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

  @Post('/image/add')
  async addCottageImage(@Body() payload: AddCottageImageDto): Promise<void> {
    await this.#_service.addCottageImage(payload);
  }

  @Patch('/image/edit/:id')
  async updateCottageImage(
    @Param('id') id: string,
    @Body() payload: UpdateCottageImageDto,
  ): Promise<void> {
    await this.#_service.updateCottageImage({ id, ...payload });
  }

  @Delete('/image/delete/:id')
  async deleteCottageImage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottageImage(id);
  }
}
