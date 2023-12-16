import { IsUUID } from "class-validator";
import { CreateRoleRequest } from "../interfaces";

export class CreateRoleDto implements CreateRoleRequest {
  @IsUUID(4)
  name: string;

  @IsUUID(4, {
    each: true,
  })
  permissions: string[];
}