import { OrderStatus, Status } from "@prisma/client";

export declare interface UpdateOrderRequest {
  orderId: string;
  status?: Status;
  orderStatus?: OrderStatus
}