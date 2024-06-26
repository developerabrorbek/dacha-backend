import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Service } from '@prisma/client';
import { CreateServiceDto, UpdateServiceDto } from './dtos';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiBearerAuth('JWT')
@ApiTags('Services')
@Controller('services')
export class ServicesController {
  #_service: ServicesService;

  constructor(service: ServicesService) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.services.get_all_services)
  @Get()
  async getAllService(
    @Headers('accept-language') languageCode: string,
  ): Promise<Service[]> {
    return await this.#_service.getAllService(languageCode);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.services.get_single_service)
  @Get('/single/:id')
  async getSingleService(
    @Headers('accept-language') languageCode: string,
    @Param('id') serviceId: string,
  ): Promise<Service> {
    return await this.#_service.getSingleService(languageCode, serviceId);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.services.create_service)
  @ApiConsumes('multipart/form-data')
  @Post('/add')
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
  async createService(
    @Body() payload: CreateServiceDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<void> {
    await this.#_service.createService({ ...payload, images });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.services.edit_service)
  @Patch('/edit/:id')
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
  async updateService(
    @Body() payload: UpdateServiceDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Param('id') id: string,
  ): Promise<void> {
    await this.#_service.updateService({ ...payload, id, images });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.services.delete_service)
  @Delete('/delete/:id')
  async deleteService(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteService(id);
  }
}
