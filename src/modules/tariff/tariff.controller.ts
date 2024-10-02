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
import { TariffService } from './tariff.service';
import { Tariff } from '@prisma/client';
import { CreateTariffDto } from './dtos/create-tariff.dto';
import { UpdateTariffDto } from './dtos';
import { CheckAuth, Permission } from '@decorators';
import { PERMISSIONS } from '@constants';

@ApiTags('Tariff')
@ApiBearerAuth('JWT')
@Controller('tariff')
export class TariffController {
  #_service: TariffService;

  constructor(service: TariffService) {
    this.#_service = service;
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.get_all_tariffs.name)
  @Get()
  async getAllTariff(
    @Headers('accept-language') languageCode: string,
  ): Promise<Tariff[]> {
    return await this.#_service.getAllTariffs(languageCode);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.create_tariff.name)
  @Post('/add')
  async createTariff(@Body() payload: CreateTariffDto): Promise<void> {
    await this.#_service.createTariff(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.edit_tariff.name)
  @Patch('/edit/:id')
  async updateTariff(
    @Param('id') id: string,
    @Body() payload: UpdateTariffDto,
  ): Promise<void> {
    await this.#_service.updateTariff({ ...payload, id });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.delete_tariff.name)
  @Delete('/delete/:id')
  async deleteTariff(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteTariff(id);
  }
}
