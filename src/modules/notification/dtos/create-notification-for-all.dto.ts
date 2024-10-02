import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CreateNotificationForAllRequest } from '../interfaces';

export class CreateNotificationForAllDto
  implements CreateNotificationForAllRequest
{
  @ApiProperty({
    required: true,
  })
  @IsString()
  message: string;

  @ApiProperty({
    enum: $Enums.NotificationType,
    nullable: true,
  })
  @IsEnum($Enums.NotificationType)
  type?: $Enums.NotificationType;
}
