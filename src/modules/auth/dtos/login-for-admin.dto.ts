import { IsOptional, IsString } from 'class-validator';
import { LoginForAdminRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class LoginForAdminDto implements LoginForAdminRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  userAgent: string;

  @ApiProperty()
  @IsString()
  username: string;
}
