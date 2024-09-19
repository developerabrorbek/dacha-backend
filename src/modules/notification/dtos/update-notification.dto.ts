import { ApiProperty } from '@nestjs/swagger';
import { UpdateNotificationRequest } from '../interfaces';
import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateNotificationDto
  implements Omit<UpdateNotificationRequest, 'notificationId'>
{
  @ApiProperty()
  @IsBoolean()
  isRead: boolean;

  @ApiProperty()
  @IsUUID(4)
  userId: string;
}
