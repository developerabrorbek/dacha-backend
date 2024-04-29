import { NotificationType } from "@prisma/client";

export declare interface CreateNotificationRequest {
  message: string;
  type?: NotificationType;
  title: string;
  userId?: string;
  createdBy?: string;
}