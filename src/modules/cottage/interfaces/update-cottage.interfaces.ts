import { CottageStatus, Status } from '@prisma/client';

export declare interface UpdateCottageRequest {
  id: string;
  name?: string;
  description?: string;
  rating?: number;
  cottageType?: string[];
  price?: number;
  priceWeekend?: number;
  comforts?: string[];
  status?: Status;
  latitude?: string;
  longitude?: string;
  bookedTime?: string[]
  cottageStatus?: CottageStatus
}
