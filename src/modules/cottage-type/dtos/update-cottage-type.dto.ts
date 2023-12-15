import { IsUUID } from 'class-validator';
import { UpdateCottageTypeRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCottageTypeDto implements Omit<UpdateCottageTypeRequest, 'id'> {
  @ApiProperty()
  @IsUUID(4)
  name: string;
}
