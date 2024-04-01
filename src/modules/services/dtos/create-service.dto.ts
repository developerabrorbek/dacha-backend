import { ApiProperty } from "@nestjs/swagger";
import { CreateServiceRequest } from "../interfaces";
import { IsEnum, IsUUID } from "class-validator";
import { ServiceCode } from "@prisma/client";

export class CreateServiceDto implements CreateServiceRequest {
  @ApiProperty()
  @IsUUID(4)
  description: string;

  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty({type: "string", format: "binary", required: true, isArray: true})
  images?: any;

  @ApiProperty({
    enum: ServiceCode
  })
  @IsEnum(ServiceCode)
  code: ServiceCode;
}