import { IsUUID } from 'class-validator';
import { CreatePlaceRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto implements CreatePlaceRequest{
  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: any;

  @ApiProperty()
  @IsUUID(4)
  regionId: string;
}
