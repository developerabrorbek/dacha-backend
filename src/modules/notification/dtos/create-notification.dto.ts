import { $Enums } from "@prisma/client";
import { CreateNotificationRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateNotificationDto implements Omit<CreateNotificationRequest,"createdBy"> {
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
  @IsOptional()
  type?: $Enums.NotificationType;

  @ApiProperty({
    nullable: true,
  })
  @IsUUID(4)
  @IsOptional()
  userId?: string;
}