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
  Query,
  // Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CottageService } from './cottage.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AddCottageImageDto,
  CreateCottageDto,
  CreatePremiumCottageDto,
  GetFilteredCottagesQueryDto,
  UpdateCottageDto,
  UpdateCottageImageDto,
} from './dtos';
import {
  GetCottageListResponse,
  GetSuitableCottageListResponse,
} from './interfaces';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MulterConfig } from '@config';

@ApiTags('Cottage')
@Controller('cottage')
export class CottageController {
  #_service: CottageService;

  constructor(service: CottageService) {
    this.#_service = service;
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottage.name)
  @Get()
  async getCottageList(
    @Headers('accept-language') languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageList(languageCode);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_on_top.name)
  @Get('top')
  async getTopCottageList(
    @Headers('accept-language') languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getTopCottageList(languageCode);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_on_top.name)
  @Get('recommended')
  async getRecommendedCottageList(
    @Headers('accept-language') languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getRecommendedCottageList(languageCode);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_by_cottage_type.name)
  @Get('cottage-type/:cottageTypeId')
  async getCottageListByCottageType(
    @Headers('accept-language') languageCode: string,
    @Param('cottageTypeId') id: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageListByCottageType(languageCode, id);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_suitable_cottages.name)
  @Get('suitable/:cottageId')
  async getSutableCottageList(
    @Headers('accept-language') languageCode: string,
    @Param('cottageId') id: string,
  ): Promise<GetSuitableCottageListResponse[]> {
    return await this.#_service.getSuitableCottageList({
      cottageId: id,
      languageCode,
    });
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_by_place.name)
  @Get('place/:placeId')
  async getCottageListByPlace(
    @Headers('accept-language') languageCode: string,
    @Param('placeId') id: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageListByPlace(languageCode, id);
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.get_all_cottages_by_user.name)
  @Get('user')
  async getCottageListByUser(
    @Headers('accept-language') languageCode: string,
    @Req() req: any,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageListByUser(languageCode, req.userId);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_by_user_id.name)
  @Get('user/:userId')
  async getCottageListByUserId(
    @Headers('accept-language') languageCode: string,
    @Param('userId') userId: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageListByUser(languageCode, userId);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_filtered_cottages.name)
  @Get('filter/?')
  async getFilteredCottageList(
    @Headers('accept-language') languageCode: string,
    @Query() queries: GetFilteredCottagesQueryDto
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getFilteredCottageList({
      languageCode,
      cottageType: queries?.type,
      price: queries.price,
      placeId: queries.place,
    });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.create_cottage.name)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'mainImage',
          maxCount: 1,
        },
        {
          name: 'images',
          maxCount: 15,
        },
      ],
      MulterConfig(),
    ),
  )
  @Post('/add')
  async createCottage(
    @Body() payload: CreateCottageDto,
    @Req() req: any,
    @UploadedFiles()
    files: {
      mainImage: Array<Express.Multer.File>;
      images: Array<Express.Multer.File>;
    },
  ): Promise<void> {
    await this.#_service.createCottage({ ...payload, files }, req.userId);
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.create_premium_cottage.name)
  @Post('/add/premium/:cottageId')
  async createPremiumCottage(
    @Param('cottageId', new ParseUUIDPipe({ version: '4' })) cottageId: string,
    @Body() payload: CreatePremiumCottageDto,
  ): Promise<void> {
    await this.#_service.createPremiumCottage({
      cottageId: cottageId,
      ...payload,
    });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.edit_cottage.name)
  @Patch('/edit/:id')
  async updateCottage(
    @Param('id') cottageId: string,
    @Body() payload: UpdateCottageDto,
  ): Promise<void> {
    await this.#_service.updateCottage({ id: cottageId, ...payload });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.delete_cottage.name)
  @Delete('/delete/:id')
  async deleteCottage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottage(id);
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.delete_premium_cottage.name)
  @Delete('/delete/premium/:premiumCottageId')
  async deletePremiumCottage(
    @Param('premiumCottageId', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.#_service.deletePremiumCottage(id);
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.create_cottage_image.name)
  @UseInterceptors(FileInterceptor('image', MulterConfig()))
  @Post('/image/add')
  async addCottageImage(
    @Body() payload: AddCottageImageDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.addCottageImage({ ...payload, image });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.edit_cottage_image.name)
  @UseInterceptors(FileInterceptor('image', MulterConfig()))
  @Patch('/image/edit/:id')
  async updateCottageImage(
    @Param('id') id: string,
    @Body() payload: UpdateCottageImageDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateCottageImage({ id, ...payload, image });
  }

  @ApiBearerAuth('JWT')
  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.delete_cottage_image.name)
  @Delete('/image/delete/:id')
  async deleteCottageImage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottageImage(id);
  }
}
