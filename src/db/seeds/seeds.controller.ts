import { Body, Controller, Post } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { ApiTags } from '@nestjs/swagger';
import { SetInitialDataDto } from './dtos';

@ApiTags('Seeds')
@Controller('seeds')
export class SeedsController {
  #_service: SeedsService;
  constructor(service: SeedsService) {
    this.#_service = service;
  }

  @Post('/set-initial-data')
  async createInitialData(@Body() body: SetInitialDataDto): Promise<void> {
    await this.#_service.setInitialDate({
      username: body?.username,
      password: body?.password,
    });
  }
}
