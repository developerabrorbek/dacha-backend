import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UpdateRoleRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto implements Omit<UpdateRoleRequest, 'id'> {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  permissions?: string[];
}
