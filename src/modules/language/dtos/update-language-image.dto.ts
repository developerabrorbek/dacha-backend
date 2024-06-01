import { ApiProperty } from '@nestjs/swagger';
import { UpdateLanguageImageRequest } from '../interfaces';

export class UpdateLanguageImageDto
  implements Omit<UpdateLanguageImageRequest, 'languageId'>
{
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary',
  })
  image: any;
}
