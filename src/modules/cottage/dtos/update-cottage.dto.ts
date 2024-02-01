import {
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
} from 'class-validator';
import { UpdateCottageRequest } from '../interfaces';
import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  priceWeekend?: number;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Max(5)
  @IsOptional()
  rating?: number;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsEnum($Enums.Status)
  @IsOptional()
  status?: $Enums.Status;

  @ApiProperty()
  @IsString({
    each: true
  })
  @IsOptional()
  bookedTime?: string[];

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsLatitude()
  @IsOptional()
  latitude?: string;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsLongitude()
  @IsOptional()
  longitude?: string;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isTop?: boolean;
}
