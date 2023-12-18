import {
  IsBase64,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
} from 'class-validator';
import { UpdateCottageRequest } from '../interfaces';
import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCottageDto implements Omit<UpdateCottageRequest, 'id'> {
  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  comforts?: string[];

  @ApiProperty()
  @IsEnum($Enums.CottageStatus)
  @IsOptional()
  cottageStatus?: $Enums.CottageStatus;

  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  cottageType?: string[];

  @ApiProperty()
  @IsUUID(4)
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsBase64()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsUUID(4)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  priceWeekend?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty()
  @IsEnum($Enums.Status)
  @IsOptional()
  status?: $Enums.Status;

  @ApiProperty()
  @IsLatitude()
  @IsOptional()
  latitude?: string;

  @ApiProperty()
  @IsLongitude()
  @IsOptional()
  longitude?: string;
}
