import { CottageStatus } from "@prisma/client";

export declare interface CreateCottageRequest {
  name: string;
  images: any[];
  mainImage: any;
  description: string;
  cottageType: string[];
  price: number;
  priceWeekend: number;
  comforts: string[];
  placeId: string;
  regionId: string;
  longitude?: string;
  latitude?: string;
  createdBy: string;
  cottageStatus?: CottageStatus;
}
