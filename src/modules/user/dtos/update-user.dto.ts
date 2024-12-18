import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { phoneRegex } from '@constants';

export class UpdateUserDto {
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
  @Matches(phoneRegex)
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID(4, {
    each: true,
  })
  roles?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any;
}
