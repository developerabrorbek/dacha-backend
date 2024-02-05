import { IsOptional, IsString, IsUUID, Matches } from "class-validator";
import { CreateUserRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";


export class CreateUserDto implements CreateUserRequest {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/)
  phone: string;

  @ApiProperty()
  @IsUUID(4, {
    each: true,
  })
  roles: string[];

  @ApiProperty()
  @IsString()
  username: string;

  @Transform(({value}) => {
    if(!value) return undefined
    else return value
  } )
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}

