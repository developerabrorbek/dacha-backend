import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  method: string;

  @ApiProperty()
  @IsObject()
  params: any;

  @ApiProperty()
  @IsNumber()
  id: number;
}
