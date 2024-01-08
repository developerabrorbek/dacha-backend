import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
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
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Cottage')
@Controller('cottage')
export class CottageController {
  #_service: CottageService;

  constructor(service: CottageService) {
    this.#_service = service;
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottage)
  @Get()
  async getCottageList(
    @Headers('accept-language') languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageList(languageCode);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_on_top)
  @Get('top')
  async getTopCottageList(
    @Headers('accept-language') languageCode: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getTopCottageList(languageCode);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_by_cottage_type)
  @Get('cottage-type/:cottageTypeId')
  async getCottageListByCottageType(
    @Headers('accept-language') languageCode: string,
    @Param('cottageTypeId') id: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageListByCottageType(languageCode, id);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_cottages_by_place)
  @Get('place/:placeId')
  async getCottageListByPlace(
    @Headers('accept-language') languageCode: string,
    @Param('placeId') id: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageListByPlace(languageCode, id);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.get_all_cottages_by_user)
  @Get('user')
  async getCottageListByUser(
    @Headers('accept-language') languageCode: string,
    @Req() req: any,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getCottageListByUser(languageCode, req.userId);
  }

  @CheckAuth(false)
  @Permission(PERMISSIONS.cottage.get_all_filtered_cottages)
  @Get('filter/?')
  async getFilteredCottageList(
    @Headers('accept-language') languageCode: string,
    @Query('type') cottageType?: string,
    @Query('region') regionId?: string,
    @Query('price') price?: string,
  ): Promise<GetCottageListResponse[]> {
    return await this.#_service.getFilteredCottageList({
      languageCode,
      cottageType,
      price: Number(price) || 10000,
      regionId,
    });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.create_cottage)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/add')
  async createCottage(
    @Body() payload: CreateCottageDto,
    @Req() req: any,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<void> {
    await this.#_service.createCottage({ ...payload, images }, req.userId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.edit_cottage)
  @Patch('/edit/:id')
  async updateCottage(
    @Param('id') cottageId: string,
    @Body() payload: UpdateCottageDto,
  ): Promise<void> {
    await this.#_service.updateCottage({ id: cottageId, ...payload });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.delete_cottage)
  @Delete('/delete/:id')
  async deleteCottage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottage(id);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.create_cottage_image)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/image/add')
  async addCottageImage(
    @Body() payload: AddCottageImageDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.addCottageImage({ ...payload, image });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.edit_cottage_image)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Patch('/image/edit/:id')
  async updateCottageImage(
    @Param('id') id: string,
    @Body() payload: UpdateCottageImageDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<void> {
    await this.#_service.updateCottageImage({ id, ...payload, image });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.cottage.delete_cottage_image)
  @Delete('/image/delete/:id')
  async deleteCottageImage(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteCottageImage(id);
  }
}
