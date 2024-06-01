import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateLanguageRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageDto implements CreateLanguageRequest {
  @ApiProperty({
    example: 'uz',
    maxLength: 2,
    type: String,
    required: true,
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  code: string;

  @ApiProperty({
    example: "O'zbek tili",
    maxLength: 64,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image: any;
}
