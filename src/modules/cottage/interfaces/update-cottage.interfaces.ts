import { CottageStatus, CottageType, Status } from '@prisma/client';

export declare interface UpdateCottageRequest {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  rating?: number;
  cottageType?: CottageType[];
  price?: number;
  priceWeekend?: number;
  comforts?: string[];
  status?: Status;
  cottageStatus?: CottageStatus
}
