import { IsUUID } from 'class-validator';
import { CreateComfortRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComfortDto implements CreateComfortRequest {
  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty({
    format: 'binary',
    type: 'string',
    required: true,
  })
  image: any;
}
