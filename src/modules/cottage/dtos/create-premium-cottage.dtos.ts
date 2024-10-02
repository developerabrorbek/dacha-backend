import { $Enums } from '@prisma/client';
import { CreatePremiumCottageRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreatePremiumCottageDto
  implements Omit<CreatePremiumCottageRequest, 'cottageId'>
{
  @ApiProperty()
  @Min(1)
  @IsInt()
  expireDays: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  priority?: number;

  @ApiProperty({
    enum: $Enums.ServiceCode,
  })
  serviceCode: $Enums.ServiceCode;
}
