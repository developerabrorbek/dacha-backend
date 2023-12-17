import {
  IsBase64,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
} from 'class-validator';
import { CreateCottageRequest } from '../interfaces';

export class CreateCottageDto implements Omit<CreateCottageRequest, "createdBy"> {
  @IsUUID(4, {
    each: true,
  })
  comforts: string[];

  @IsUUID(4, {
    each: true,
  })
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

  @IsLatitude()
  lattitude: string;

  @IsLongitude()
  longitude: string;
}
