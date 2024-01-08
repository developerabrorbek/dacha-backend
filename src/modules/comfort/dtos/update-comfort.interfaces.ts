import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateComfortDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID(4)
  name?: string;
}
