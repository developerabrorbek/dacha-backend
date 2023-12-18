import { IsUUID } from "class-validator";
import { CreateRoleRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto implements CreateRoleRequest {
  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  permissions: string[];
}