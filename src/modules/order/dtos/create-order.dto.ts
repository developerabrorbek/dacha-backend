import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderRequest } from '../interfaces';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto implements Omit<CreateOrderRequest, 'assignedBy'> {
  @ApiProperty()
  @IsUUID(4)
  cottageId: string;

  @ApiProperty()
  @IsUUID(4)
  tariffId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  priority?: number;
}
