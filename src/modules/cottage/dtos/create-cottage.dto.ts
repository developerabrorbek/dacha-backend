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
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  priceWeekend: number;

  @ApiProperty()
  @IsUUID(4)
  regionId: string;

  @Transform(({ value }) => {
    if (!value) return undefined;
    else return parseFloat(value);
  })
  @ApiProperty()
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @Transform(({ value }) => {
    if (!value) return undefined;
    else return parseFloat(value);
  })
  @ApiProperty()
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty()
  @IsEnum($Enums.CottageStatus)
  @IsOptional()
  cottageStatus?: $Enums.CottageStatus;
}
