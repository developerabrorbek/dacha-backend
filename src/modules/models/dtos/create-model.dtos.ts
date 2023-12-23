import { IsString } from "class-validator";
import { CreateModelRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class CreateModelDto implements CreateModelRequest {
  @ApiProperty()
  @IsString()
  name: string;
}