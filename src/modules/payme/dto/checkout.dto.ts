import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CheckoutPaymentDto {
  @ApiProperty()
  @IsUUID(4)
  orderId: string;
  
  @ApiProperty()
  url: string;
}
