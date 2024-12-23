import { CottageStatus } from '@prisma/client';

export declare interface CreateCottageRequest {
  name: string;
  files: any;
  description: string;
  cottageType: string[];
  price: number;
  priceWeekend: number;
  comforts: string[];
  placeId: string;
  regionId: string;
  longitude?: number;
  latitude?: number;
  createdBy: string;
  cottageStatus?: CottageStatus;
}
