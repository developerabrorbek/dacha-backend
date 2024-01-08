import { $Enums } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCottageImageDto {
  @ApiProperty()
  @IsEnum($Enums.Status)
  @IsOptional()
  status?: $Enums.Status;
}
