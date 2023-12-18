import { IsBase64, IsUUID } from 'class-validator';
import { CreateComfortRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComfortDto implements CreateComfortRequest {
  @ApiProperty()
  @IsBase64()
  image: string;

  @ApiProperty()
  @IsUUID(4)
  name: string;
}
