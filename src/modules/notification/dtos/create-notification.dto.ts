import { $Enums } from '@prisma/client';
import { CreateNotificationRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateNotificationDto
  implements Omit<CreateNotificationRequest, 'createdBy'>
{

  @ApiProperty({
    required: true,
  })
  @IsString()
  message: string;

  @Transform(({ value }) => {
    if (!value) return undefined;
    else return value;
  })
  @ApiProperty({
    enum: $Enums.NotificationType,
    nullable: true,
  })
  @IsEnum($Enums.NotificationType)
  type?: $Enums.NotificationType;

  @Transform(({ value }) => {
    if (!value) return undefined;
    else return value;
  })
  @ApiProperty({
    nullable: true,
  })
  @IsUUID(4)
  @IsOptional()
  userId?: string;
}
