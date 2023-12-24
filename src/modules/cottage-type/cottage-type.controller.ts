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
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags('Cottage Type')
@Controller('cottage-type')
export class CottageTypeController {
  #_service: CottageTypeService;

  constructor(service: CottageTypeService) {
    this.#_service = service;
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage_type.get_all_cottage_type)
  @Get()
  async getCottageTypeList(
    @Headers('accept-language') languageCode: string,
  ): Promise<CottageType[]> {
    return await this.#_service.getCottageTypeList(languageCode);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.create_cottage_type)
  @Post('/add')
  async createCottageType(@Body() payload: CreateCottageTypeDto): Promise<void> {
    await this.#_service.createCottageType(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.edit_cottage_type)
  @Patch('/edit/:id')
  async updateCottageType(
    @Param('id') cottageTypeId: string,
    @Body() paylaod: UpdateCottageTypeDto,
  ): Promise<void> {
    await this.#_service.updateCottageType({ id: cottageTypeId, name: paylaod.name });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.delete_cottage_type)
  @Delete("/delete/:id")
  async deleteCottageType(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottageType(id);
  }
}
