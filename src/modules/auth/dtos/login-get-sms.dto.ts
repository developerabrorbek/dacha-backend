import { IsString, Matches } from "class-validator";
import { LoginGetSMSCodeRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { phoneRegex } from "@constants";

export class LoginGetSMSDto implements LoginGetSMSCodeRequest {
  @ApiProperty()
  @Matches(phoneRegex)
  @IsString()
  phone: string;
}