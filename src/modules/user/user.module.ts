import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "prisma/prisma.service";
import { MinioService } from "@client";
import { ConfigService } from "@nestjs/config";
import { UserController } from "./user.controller";

@Module({
  providers: [ConfigService,MinioService,PrismaService,UserService],
  controllers: [UserController],
})
export class UserModule {}