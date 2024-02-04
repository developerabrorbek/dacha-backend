import { IsOptional, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdatePlaceDto {
  @Transform((val) => {
    if (!val) return undefined;
    else return val
  })
  @ApiProperty()
  @IsUUID(4)
  @IsOptional()
  name?: string;
}
