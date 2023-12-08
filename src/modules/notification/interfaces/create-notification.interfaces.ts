import { NotificationStatus, NotificationType } from "@prisma/client";

export declare interface CreateNotificationRequest {
  message: string;
  type?: NotificationType;
  status?: NotificationStatus;
  userId?: string;
  createdBy?: string;
}