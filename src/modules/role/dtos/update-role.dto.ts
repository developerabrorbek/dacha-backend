import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UpdateRoleRequest } from '../interfaces';

export class UpdateRoleDto implements Omit<UpdateRoleRequest, 'id'> {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID(4, {
    each: true,
  })
  @IsOptional()
  permissions?: string[];
}
