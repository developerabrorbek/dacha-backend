import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaceDto {
  @ApiProperty()
  @IsUUID(4)
  name: string;
}
