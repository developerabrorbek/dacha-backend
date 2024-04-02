import { ApiProperty } from '@nestjs/swagger';
import { DisableTariffRequest } from '../interfaces';
import { IsUUID } from 'class-validator';

export class DisableTariffDto implements DisableTariffRequest {
  @ApiProperty()
  @IsUUID()
  cottageId: string;

  @ApiProperty()
  @IsUUID()
  tariffId: string;
}
