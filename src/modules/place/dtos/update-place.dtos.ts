import { IsBase64, IsOptional, IsUUID } from 'class-validator';
import { UpdatePlaceRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaceDto implements Omit<UpdatePlaceRequest, 'id'> {
  @ApiProperty()
  @IsOptional()
  @IsBase64()
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(4)
  name?: string;
}
