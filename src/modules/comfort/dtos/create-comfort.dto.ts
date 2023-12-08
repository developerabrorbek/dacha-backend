import { IsBase64, IsUUID } from 'class-validator';
import { CreateComfortRequest } from '../interfaces';

export class CreateComfortDto implements CreateComfortRequest {
  @IsBase64()
  image: string;

  @IsUUID(4)
  name: string;
}
