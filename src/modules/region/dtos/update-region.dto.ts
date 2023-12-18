import { IsUUID } from 'class-validator';
import { UpdateRegionRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRegionDto implements Omit<UpdateRegionRequest, 'id'> {
  @ApiProperty()
  @IsUUID(4)
  name: string;
}
