import { $Enums } from '@prisma/client';
import { UpdateCottageImageRequest } from '../interfaces';
import { IsBase64, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCottageImageDto
  implements Omit<UpdateCottageImageRequest, 'id'>
{
  @ApiProperty()
  @IsBase64()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsEnum($Enums.Status)
  @IsOptional()
  status?: $Enums.Status;
}
