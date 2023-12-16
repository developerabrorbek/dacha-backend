import { IsUUID } from 'class-validator';
import { UpdateModelRequest } from '../interfaces';

export class UpdateModelDto implements Omit<UpdateModelRequest, 'id'> {
  @IsUUID(4)
  name: string;
}
