import { IsUUID } from 'class-validator';
import { CreatePlaceRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto implements Omit<CreatePlaceRequest, 'image'> {
  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty()
  @IsUUID(4)
  regionId: string;
}
