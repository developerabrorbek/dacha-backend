import { ApiProperty } from '@nestjs/swagger';
import { AddCottageImageRequest } from '../interfaces';
import { IsUUID } from 'class-validator';

export class AddCottageImageDto
  implements Omit<AddCottageImageRequest, 'image'>
{
  @ApiProperty()
  @IsUUID(4)
  cottageId: string;
}
