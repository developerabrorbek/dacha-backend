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
  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  comforts?: string[];

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsEnum($Enums.CottageStatus)
  @IsOptional()
  cottageStatus?: $Enums.CottageStatus;

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  cottageType?: string[];

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  priceWeekend?: number;

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
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

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsString({
    each: true
  })
  @IsOptional()
  bookedTime?: string[];

  @Transform(({ value }) => {
    if (!value) return undefined;
    else return parseFloat(value);
  })
  @ApiProperty()
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @Transform(({ value }) => {
    if (!value) return undefined;
    else return parseFloat(value);
  })
  @ApiProperty()
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isTop?: boolean;
}
