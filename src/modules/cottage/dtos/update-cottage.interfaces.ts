import {
  IsBase64,
  IsEnum,
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

  @IsEnum($Enums.CottageType, {
    each: true,
  })
  @IsOptional()
  cottageType?: $Enums.CottageType[];

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
}
