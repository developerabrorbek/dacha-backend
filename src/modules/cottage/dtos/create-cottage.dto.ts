import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class CreateCottageDto {
  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  comforts: string[];

  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  cottageType: string[];

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID(4)
  placeId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  priceWeekend: number;

  @ApiProperty()
  @IsUUID(4)
  regionId: string;

  @ApiProperty()
  @IsOptional()
  @IsLatitude()
  latitude?: string;

  @ApiProperty()
  @IsOptional()
  @IsLongitude()
  longitude?: string;

  @ApiProperty()
  @IsEnum($Enums.CottageStatus)
  @IsOptional()
  cottageStatus?: $Enums.CottageStatus;
}
