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
import { DisableTariffDto, UpdateTariffDto, UseTariffDto } from './dtos';
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
  @Permission(PERMISSIONS.tariff.get_all_tariffs)
  @Get()
  async getAllTariff(
    @Headers('accept-language') languageCode: string,
  ): Promise<Tariff[]> {
    return await this.#_service.getAllTariffs(languageCode);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.create_tariff)
  @Post('/add')
  async createTariff(@Body() payload: CreateTariffDto): Promise<void> {
    await this.#_service.createTariff(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.activate_tariff)
  @Post('/activate')
  async activateTariff(@Body() payload: UseTariffDto): Promise<void> {
    await this.#_service.activateTariff(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.edit_tariff)
  @Patch('/edit/:id')
  async updateTariff(
    @Param('id') id: string,
    @Body() payload: UpdateTariffDto,
  ): Promise<void> {
    await this.#_service.updateTariff({ ...payload, id });
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.delete_tariff)
  @Delete('/disable')
  async disableTariff(@Body() payload: DisableTariffDto): Promise<void> {
    await this.#_service.disableTariff(payload);
  }

  @CheckAuth(true)
  @Permission(PERMISSIONS.tariff.delete_tariff)
  @Delete('/delete/:id')
  async deleteTariff(@Param('id') id: string): Promise<void> {
    await this.#_service.deleteTariff(id);
  }
}
