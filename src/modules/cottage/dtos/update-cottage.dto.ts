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

export class UpdateCottageDto implements Omit<UpdateCottageRequest, 'id'> {
  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  comforts?: string[];

  @IsEnum($Enums.CottageStatus)
  @IsOptional()
  cottageStatus?: $Enums.CottageStatus;

  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  cottageType?: string[];

  @IsUUID(4)
  @IsOptional()
  description?: string;

  @IsBase64()
  @IsOptional()
  image?: string;

  @IsUUID(4)
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  priceWeekend?: number;

  @IsNumber()
  @IsPositive()
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsEnum($Enums.Status)
  @IsOptional()
  status?: $Enums.Status;

  @IsLatitude()
  @IsOptional()
  latitude?: string;

  @IsLongitude()
  @IsOptional()
  longitude?: string;
}
