import { IsUUID } from "class-validator";
import { CreateRegionRequest } from "../interfaces";

export class CreateRegionDto implements CreateRegionRequest {
  @IsUUID(4)
  name: string;
}