import { CottageStatus, Status } from '@prisma/client';

export declare interface UpdateCottageRequest {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  rating?: number;
  cottageType?: string[];
  price?: number;
  priceWeekend?: number;
  comforts?: string[];
  status?: Status;
  latitude?: string;
  longitude?: string;
  cottageStatus?: CottageStatus
}
