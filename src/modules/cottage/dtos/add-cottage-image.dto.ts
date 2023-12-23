import { ApiProperty } from '@nestjs/swagger';
import { AddCottageImageRequest } from '../interfaces';
import { IsBase64, IsUUID } from 'class-validator';

export class AddCottageImageDto implements AddCottageImageRequest {
  @ApiProperty()
  @IsUUID(4)
  cottageId: string;

  @ApiProperty()
  @IsBase64()
  image: string;
}
