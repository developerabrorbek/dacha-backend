import { CottageType } from '@prisma/client';

export declare interface CreateCottageRequest {
  name: string;
  images: string[];
  description: string;
  rating: number;
  cottageType: CottageType[];
  price: number;
  priceWeekend: number;
  comforts: string[];
  placeId: string;
  regionId: string;
}
