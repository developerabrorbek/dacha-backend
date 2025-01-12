import { Status } from '@prisma/client';
import { GetComfortsInterface } from './get-comforts.interfaces';
import { GetCottageTypesInterfaces } from './get-cottage-types.interfaces';

declare interface ImagesInterface {
  id: string;
  image: string;
  isMainImage: boolean;
}

export declare interface GetCottageListResponse {
  id: string;
  name: string;
  images: ImagesInterface[];
  rating: number;
  description: string;
  cottageType: GetCottageTypesInterfaces[];
  price: number;
  priceWeekend: number;
  comforts: GetComfortsInterface[];
  place: {
    name: string;
    id: string;
  };
  region: {
    name: string;
    id: string;
  };
  longitude?: string;
  latitude?: string;
  cottageStatus?: string;
  isTop? :boolean;
  user: any
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  premiumCottages?: any;
  orders?: any;
  events?: any;
}
