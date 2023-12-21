import { IsBase64, IsOptional, IsUUID } from 'class-validator';
import { UpdateComfortRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateComfortDto implements Omit<UpdateComfortRequest, 'id'> {
  @ApiProperty()
  @IsBase64()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(4)
  name?: string;
}
