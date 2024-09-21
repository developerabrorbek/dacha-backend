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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CottageType } from '@prisma/client';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { CottageTypeService } from './cottage-type.service';
import { UpdateCottageTypeDto, CreateCottageTypeDto } from './dtos';

@ApiTags('Cottage Type')
@Controller('cottage-type')
export class CottageTypeController {
  #_service: CottageTypeService;

  constructor(service: CottageTypeService) {
    this.#_service = service;
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage_type.get_all_cottage_type.name)
  @Get()
  async getCottageTypeList(
    @Headers('accept-language') languageCode: string,
  ): Promise<CottageType[]> {
    return await this.#_service.getCottageTypeList(languageCode);
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.create_cottage_type.name)
  @Post('/add')
  async createCottageType(
    @Body() payload: CreateCottageTypeDto,
  ): Promise<void> {
    await this.#_service.createCottageType(payload);
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.edit_cottage_type.name)
  @Patch('/edit/:id')
  async updateCottageType(
    @Param('id') cottageTypeId: string,
    @Body() paylaod: UpdateCottageTypeDto,
  ): Promise<void> {
    await this.#_service.updateCottageType({
      id: cottageTypeId,
      name: paylaod.name,
    });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.delete_cottage_type.name)
  @Delete('/delete/:id')
  async deleteCottageType(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottageType(id);
  }
}
