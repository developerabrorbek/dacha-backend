import { ApiProperty } from '@nestjs/swagger';
import { setInitialData } from '../interfaces';
import { IsString } from 'class-validator';

export class SetInitialDataDto implements setInitialData {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  username: string;
}
