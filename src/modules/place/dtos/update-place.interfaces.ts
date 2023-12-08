import { IsBase64, IsOptional, IsUUID } from 'class-validator';
import { UpdatePlaceRequest } from '../interfaces';

export class UpdatePlaceDto implements Omit<UpdatePlaceRequest, 'id'> {
  @IsOptional()
  @IsBase64()
  image?: string;

  @IsOptional()
  @IsUUID(4)
  name?: string;
}
