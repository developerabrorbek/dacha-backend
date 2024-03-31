import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { UpdateServiceRequest } from "../interfaces";

export class UpdateServiceDto implements Omit<UpdateServiceRequest, "id"> {
  @ApiProperty()
  @IsOptional()
  @IsUUID(4)
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(4)
  name?: string;

  @ApiProperty()
  @IsOptional()
  images?: any;
}