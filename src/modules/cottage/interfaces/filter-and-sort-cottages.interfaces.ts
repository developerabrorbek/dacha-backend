import { CottageStatus, Status } from '@prisma/client';
import { SortFields } from '../dtos/filter-and-sort-cottages.dto';

export declare interface FilterAndSortCottagesQuery {
  minRating?: number;
  maxRating?: number;
  cottageStatus?: CottageStatus;
  minPrice?: number;
  maxPrice?: number;
  minPriceWeekend?: number;
  maxPriceWeekend?: number;
  status?: Status;
  isTest?: boolean;
  cottageTypes?: string[];
  comforts?: string[];
  regionId?: string;
  placeId?: string;
  sortField?: SortFields;
  sortOrder?: 'asc' | 'desc';
}
