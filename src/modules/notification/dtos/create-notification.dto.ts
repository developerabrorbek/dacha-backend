import { $Enums } from '@prisma/client';
import { CreateNotificationRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto implements CreateNotificationRequest {
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

  @ApiProperty({
    nullable: true,
  })
  @IsUUID(4)
  userId: string;
}
