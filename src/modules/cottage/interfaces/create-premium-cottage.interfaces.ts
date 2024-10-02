import { ServiceCode } from '@prisma/client';

export declare interface CreatePremiumCottageRequest {
  cottageId: string;
  priority?: number;
  serviceCode: ServiceCode;
  expireDays: number;
}
