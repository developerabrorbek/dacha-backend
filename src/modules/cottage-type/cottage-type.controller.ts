import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CottageType } from '@prisma/client';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { CottageTypeService } from './cottage-type.service';
import {
  UpdateCottageTypeDto,
  CreateCottageTypeDto,
  UpdateCottageTypeImageDto,
} from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '@config';

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
  @ApiConsumes('multipart/form-data')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.create_cottage_type.name)
  @Post('/add')
  @UseInterceptors(FileInterceptor('image', MulterConfig()))
  async createCottageType(
    @Body() payload: CreateCottageTypeDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.createCottageType({ ...payload, image });
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
  @ApiConsumes('multipart/form-data')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage_type.edit_cottage_type_image.name)
  @Patch('/edit/image/:placeId')
  @UseInterceptors(FileInterceptor('image', MulterConfig()))
  async updateCottageTypeImage(
    @Param('placeId', new ParseUUIDPipe({version: "4"})) cottageTypeId: string,
    @Body() paylaod: UpdateCottageTypeImageDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateCottageTypeImage({
      id: cottageTypeId,
      image,
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
