import { IsUUID } from 'class-validator';
import { UpdateModelRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateModelDto implements Omit<UpdateModelRequest, 'id'> {
  @ApiProperty()
  @IsUUID(4)
  name: string;
}
