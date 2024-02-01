import { IsUUID } from 'class-validator';
import { CreateComfortRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComfortDto implements Omit<CreateComfortRequest, 'image'> {
  @ApiProperty()
  @IsUUID(4)
  name: string;
}