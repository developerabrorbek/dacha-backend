import { CottageStatus } from "@prisma/client";

export declare interface ImageRequest {
  image: string;
  isMain: boolean;
}

export declare interface CreateCottageRequest {
  name: string;
  images: ImageRequest[];
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
