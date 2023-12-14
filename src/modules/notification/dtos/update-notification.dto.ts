import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  watchedUserId?: string;

  @ApiProperty({
    enum: $Enums.NotificationStatus,
    nullable: true,
  })
  @IsEnum($Enums.NotificationStatus)
  @IsOptional()
  status?: $Enums.NotificationStatus;
}