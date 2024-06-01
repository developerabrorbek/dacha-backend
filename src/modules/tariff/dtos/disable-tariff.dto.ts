import { ApiProperty } from '@nestjs/swagger';
import { DisableTariffRequest } from '../interfaces';
import { IsOptional, IsUUID } from 'class-validator';
import { $Enums } from '@prisma/client';

export class DisableTariffDto implements DisableTariffRequest {
  @ApiProperty()
  @IsUUID()
  cottageId: string;

  @ApiProperty()
  @IsUUID()
  tariffId: string;

  @ApiProperty({
    required: false,
    enum: $Enums.Status
  })
  @IsOptional()
  status?: $Enums.Status;

  @ApiProperty({
    required: false,
    enum: $Enums.CottageOnTariffStatus
  })
  @IsOptional()
  tariffStatus?: $Enums.CottageOnTariffStatus;
}
