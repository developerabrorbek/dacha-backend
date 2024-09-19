import { NotificationType } from '@prisma/client';

export declare interface CreateNotificationForAllRequest {
  message: string;
  type?: NotificationType;
}
