import { IsOptional, IsString, IsUUID, Matches } from "class-validator";
import { CreateUserRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { phoneRegex } from "@constants";


export class CreateUserDto implements CreateUserRequest {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @Matches(phoneRegex)
  phone: string;

  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  roles: string[];

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}

