import {
  IsArray,
  IsBase64,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from "class-transformer"
import { CreateCottageRequest, ImageRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

class ImageCreateDto {
  @ApiProperty()
  @IsBase64()
  image: string;

  @ApiProperty()
  @IsBoolean()
  isMain: boolean
}

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
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ImageCreateDto)
  images: ImageRequest[];

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
}
