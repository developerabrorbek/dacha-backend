import { ApiProperty } from '@nestjs/swagger';
import { UpdateComfortImageRequest } from '../interfaces';

export class UpdateComfortImageDto implements Omit<UpdateComfortImageRequest,"id"> {
  @ApiProperty({
    format: 'binary',
    type: 'string',
    required: true,
  })
  image: any;
}
