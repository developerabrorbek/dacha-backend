import { ApiProperty } from '@nestjs/swagger';
import { AddCottageImageRequest } from '../interfaces';
import { IsBoolean, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddCottageImageDto
  implements Omit<AddCottageImageRequest, 'image'>
{
  @ApiProperty()
  @IsUUID(4)
  cottageId: string;

  @Transform(({ value }) => {
    if (value == 'true') return true;
    else return false;
  })
  @ApiProperty()
  @IsBoolean()
  isMainImage: boolean;
}
