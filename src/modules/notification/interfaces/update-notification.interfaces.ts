import { NotificationStatus } from "@prisma/client";

export declare interface UpdateNotificationRequest {
  id: string;
  userId: string;
  status?: NotificationStatus;
  watchedUserId?: string;
}