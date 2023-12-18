import { IsUUID } from "class-validator";
import { CreateRegionRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRegionDto implements CreateRegionRequest {
  @ApiProperty()
  @IsUUID(4)
  name: string;
}