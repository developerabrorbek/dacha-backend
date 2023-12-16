import { IsString } from 'class-validator';
import { UpdatePermissionRequest } from '../interfaces';

export class UpdatePermissionDto implements Omit<UpdatePermissionRequest, 'id'> {
  @IsString()
  name: string;
}
