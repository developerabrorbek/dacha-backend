import { ApiProperty } from '@nestjs/swagger';

export class UpdateCottageTypeImageDto {
  @ApiProperty({
    type: String,
    format: 'binary',
    required: true,
  })
  image: any;
}
