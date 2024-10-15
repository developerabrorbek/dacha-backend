import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class GetFilteredCottagesQueryDto {
  @ApiProperty({
    type: 'number',
    required: false,
    example: 100,
  })
  @IsOptional()
  @IsNumberString()
  price?: number;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsUUID(4)
  type?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsUUID(4)
  place?: string;
}
