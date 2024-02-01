import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateComfortDto {
  @Transform((val) => {
    if (!val) return undefined;
  })
  @ApiProperty()
  @IsOptional()
  @IsUUID(4)
  name?: string;
}
