import {
  IsBase64,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
} from 'class-validator';
import { CreateCottageRequest } from '../interfaces';
import { $Enums } from '@prisma/client';

export class CreateCottageDto implements CreateCottageRequest {
  @IsUUID(4, {
    each: true,
  })
  comforts: string[];

  cottageType: string[];

  @IsString()
  description: string;

  @IsBase64({
    each: true,
  })
  images: string[];

  @IsUUID()
  name: string;

  @IsUUID(4)
  placeId: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  priceWeekend: number;

  @IsNumber()
  @Max(5)
  @IsPositive()
  rating: number;

  @IsUUID(4)
  regionId: string;
}
