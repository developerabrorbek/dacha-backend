import { IsBase64, IsUUID } from 'class-validator';
import { CreatePlaceRequest } from '../interfaces';

export class CreatePlaceDto implements CreatePlaceRequest {
  @IsBase64()
  image: string;

  @IsUUID(4)
  name: string;

  @IsUUID(4)
  regionId: string;
}
