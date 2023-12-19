import { IsString, Matches } from "class-validator";
import { LoginGetSMSCodeRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class LoginGetSMSDto implements LoginGetSMSCodeRequest {
  @ApiProperty()
  @Matches(/^(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/)
  @IsString()
  phone: string;
}