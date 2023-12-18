import { IsUUID } from "class-validator";
import { CreateCottageTypeRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCottageTypeDto implements CreateCottageTypeRequest {
  @ApiProperty()
  @ApiProperty()
  @IsUUID(4)
  name: string;
}