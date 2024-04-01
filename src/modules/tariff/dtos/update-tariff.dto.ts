import { ApiProperty } from '@nestjs/swagger';
import { UpdateTariffRequest } from '../interfaces';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTariffDto implements Omit<UpdateTariffRequest, "id"> {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  days?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID(4)
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price?: number;
}
