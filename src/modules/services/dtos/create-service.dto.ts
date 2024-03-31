import { ApiProperty } from "@nestjs/swagger";
import { CreateServiceRequest } from "../interfaces";
import { IsUUID } from "class-validator";

export class CreateServiceDto implements CreateServiceRequest {
  @ApiProperty()
  @IsUUID(4)
  description: string;

  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty()
  images?: any;
}