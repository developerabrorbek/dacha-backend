import { ApiProperty } from '@nestjs/swagger';
import { CreateTariffRequest } from '../interfaces';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTariffDto implements CreateTariffRequest {
  @ApiProperty()
  @IsNumber()
  days: number;

  @ApiProperty()
  @IsString()
  @IsUUID(4)
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsUUID(4)
  service_id: string;

  @ApiProperty()
  @IsString()
  @IsUUID(4)
  type: string;
}
