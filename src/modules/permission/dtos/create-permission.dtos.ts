import { IsString, IsUUID } from "class-validator";
import { CreatePermissionRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePermissionDto implements CreatePermissionRequest {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID(4)
  modelId: string;

  @ApiProperty()
  @IsString()
  code: string;
}