import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { FilterAndSortCottagesQuery } from '../interfaces';
import { $Enums } from '@prisma/client';
import { Transform } from 'class-transformer';

export enum SortFields {
  name = 'name',
  price = 'price',
  priceWeekend = 'priceWeekend',
  rating = 'rating',
  createdAt = 'createdAt',
}

export class FilterAndSortCottagesQueryDto
  implements FilterAndSortCottagesQuery
{
  @ApiProperty({
    type: 'number',
    required: false,
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt()
  minRating?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt()
  maxRating?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 1000000,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt()
  minPrice?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 3000000,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt()
  maxPrice?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 2200000,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt()
  maxPriceWeekend?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 1200000,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsInt()
  minPriceWeekend?: number;

  @ApiProperty({
    type: 'BOOLEAN',
    required: false,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  isTest?: boolean;

  @ApiProperty({
    enum: $Enums.CottageStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum($Enums.CottageStatus)
  cottageStatus?: $Enums.CottageStatus;

  @ApiProperty({
    enum: $Enums.Status,
    required: false,
  })
  @IsOptional()
  @IsEnum($Enums.Status)
  status?: $Enums.Status;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsUUID(4)
  placeId?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsUUID(4)
  regionId?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example:
      '4d918070-c245-43b7-82e2-b33347d2673d,4d918070-c245-43b7-82e2-b33347d2673d',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? value.split(',').map((uuid: string) => uuid.trim()) : [],
  )
  @IsArray()
  @IsUUID('4', { each: true })
  comforts?: string[];

  @ApiProperty({
    type: 'string',
    required: false,
    example:
      '4d918070-c245-43b7-82e2-b33347d2673d,4d918070-c245-43b7-82e2-b33347d2673d',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? value.split(',').map((uuid: string) => uuid.trim()) : [],
  )
  @IsArray()
  @IsUUID('4', { each: true })
  cottageTypes?: string[];

  @ApiProperty({
    enum: SortFields,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortFields)
  sortField?: SortFields;

  @ApiProperty({
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
