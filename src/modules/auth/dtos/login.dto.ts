import { IsOptional, IsString, IsUUID } from 'class-validator';
import { LoginRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements LoginRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty()
  @IsString()
  smsCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty()
  @IsUUID(4)
  userId: string;
}
