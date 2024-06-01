import { GetComfortsInterface } from "./get-comforts.interfaces";
import { GetCottageTypesInterfaces } from "./get-cottage-types.interfaces";

export declare interface GetSuitableCottageListRequest {
  languageCode: string;
  cottageId: string;
}

declare interface ImagesInterface {
  id: string;
  image: string;
  isMainImage: boolean;
}


export declare interface GetSuitableCottageListResponse {
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
}