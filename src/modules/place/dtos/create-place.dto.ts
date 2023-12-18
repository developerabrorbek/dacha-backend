import { IsBase64, IsUUID } from 'class-validator';
import { CreatePlaceRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto implements CreatePlaceRequest {
  @ApiProperty()
  @IsBase64()
  image: string;

  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty()
  @IsUUID(4)
  regionId: string;
}
