import {
  IsBase64,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { UpdateUserRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto implements Omit<UpdateUserRequest, 'id'> {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(4, {
    each: true,
  })
  favoriteCottages?: string[];

  @ApiProperty()
  @IsOptional()
  @IsBase64()
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @Matches(/^(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/)
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(4, {
    each: true,
  })
  roles?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;
}
