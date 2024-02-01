import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateUserDto  {
  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsOptional()
  @IsUUID(4, {
    each: true,
  })
  favoriteCottages?: string[];

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @Transform(({value}) => {
    if(!value) return undefined
  } )
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

  @Transform(({value}) => {
    if(!value) return undefined
  } )
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;
}
