import { IsString } from 'class-validator';
import { UpdatePermissionRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto implements Omit<UpdatePermissionRequest, 'id'> {
  @ApiProperty()
  @IsString()
  name: string;
}
