import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { PrismaService } from "prisma/prisma.service";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [NotificationController],
  providers: [PrismaService, NotificationService]
})
export class NotificationModule {}