import { IsBase64, IsOptional, IsUUID } from 'class-validator';
import { UpdateComfortRequest } from '../interfaces';

export class UpdateComfortDto implements Omit<UpdateComfortRequest, 'id'> {
  @IsOptional()
  @IsBase64()
  image?: string;

  @IsOptional()
  @IsUUID(4)
  name?: string;
}
