import { ApiProperty } from "@nestjs/swagger";
import { UseTariffRequest } from "../interfaces";
import { IsUUID } from "class-validator";

export class UseTariffDto implements UseTariffRequest {
  @ApiProperty()
  @IsUUID()
  assignedBy: string;

  @ApiProperty()
  @IsUUID()
  cottageId: string;

  @ApiProperty()
  @IsUUID()
  tariffId: string;
}