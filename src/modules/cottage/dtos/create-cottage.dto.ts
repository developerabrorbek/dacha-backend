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
import { ApiProperty } from '@nestjs/swagger';

export class CreateCottageDto implements Omit<CreateCottageRequest, "createdBy"> {
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
  @IsBase64({
    each: true,
  })
  images: string[];

  @ApiProperty()
  @IsUUID()
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
  @IsNumber()
  @Max(5)
  @IsPositive()
  rating: number;

  @ApiProperty()
  @IsUUID(4)
  regionId: string;

  @ApiProperty()
  @IsLatitude()
  lattitude: string;

  @ApiProperty()
  @IsLongitude()
  longitude: string;
}
