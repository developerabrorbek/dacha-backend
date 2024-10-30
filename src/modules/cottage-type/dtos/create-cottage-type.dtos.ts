import { IsUUID } from "class-validator";
import { CreateCottageTypeRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCottageTypeDto implements Omit<CreateCottageTypeRequest, "image"> {
  @ApiProperty()
  @ApiProperty()
  @IsUUID(4)
  name: string;

  @ApiProperty({
    type: String,
    format: "binary",
    required: true
  })
  image: any;
}