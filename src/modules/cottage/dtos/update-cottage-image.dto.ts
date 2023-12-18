import { $Enums } from '@prisma/client';
import { UpdateCottageImageRequest } from '../interfaces';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCottageImageDto
  implements Omit<UpdateCottageImageRequest, 'id'>
{
  @ApiProperty()
  @IsEnum($Enums.MainImage)
  @IsOptional()
  mainImage?: $Enums.MainImage;

  @ApiProperty()
  @IsEnum($Enums.Status)
  @IsOptional()
  status?: $Enums.Status;
}
