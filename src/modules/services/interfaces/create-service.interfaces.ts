import { ServiceCode } from "@prisma/client";

export declare interface CreateServiceRequest {
  code: ServiceCode;
  name: string;
  images? : any;
  description: string;
}