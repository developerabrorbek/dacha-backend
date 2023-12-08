import { $Enums } from '@prisma/client';
import { UpdateCottageImageRequest } from '../interfaces';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCottageImageDto
  implements Omit<UpdateCottageImageRequest, 'id'>
{
  @IsEnum($Enums.MainImage)
  @IsOptional()
  mainImage?: $Enums.MainImage;

  @IsEnum($Enums.Status)
  @IsOptional()
  status?: $Enums.Status;
}
