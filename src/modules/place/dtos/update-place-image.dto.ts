import { ApiProperty } from '@nestjs/swagger';
import { UpdatePlaceImageRequest } from '../interfaces';

export class UpdatePlaceImageDto
  implements Omit<UpdatePlaceImageRequest, 'id'>
{
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;
}
