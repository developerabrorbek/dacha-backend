import { IsUUID } from 'class-validator';
import { UpdateRegionRequest } from '../interfaces';

export class UpdateRegionDto implements Omit<UpdateRegionRequest, 'id'> {
  @IsUUID(4)
  name: string;
}
