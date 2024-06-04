import { $Enums } from '@prisma/client';
import { UpdateOrderRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto implements Omit<UpdateOrderRequest, "orderId"> {
  @ApiProperty({
    enum: $Enums.OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum($Enums.OrderStatus)
  orderStatus?: $Enums.OrderStatus;

  @ApiProperty({
    enum: $Enums.Status,
    required: false,
  })
  @IsOptional()
  @IsEnum($Enums.Status)
  status?: $Enums.Status;
}
