import { IsUUID } from "class-validator";
import { CreateModelRequest } from "../interfaces";

export class CreateModelDto implements CreateModelRequest {
  @IsUUID(4)
  name: string;
}