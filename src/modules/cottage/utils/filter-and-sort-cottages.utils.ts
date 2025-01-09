import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilterAndSortCottagesQuery } from '../interfaces';

@Injectable()
export class FilterAndSortCottages {
  generateQuery(
    params: FilterAndSortCottagesQuery,
  ): Prisma.CottageFindManyArgs {
    const filters: Prisma.CottageWhereInput = {
      ...(params.maxPrice && { price: { lte: params.maxPrice } }),
      ...(params.minPrice && { price: { gte: params.minPrice } }),
      ...(params.maxPriceWeekend && { priceWeekend: { lte: params.maxPriceWeekend } }),
      ...(params.minPriceWeekend && { priceWeekend: { gte: params.minPriceWeekend } }),
      ...(params.maxRating && { rating: { lte: params.maxRating } }),
      ...(params.minRating && { rating: { gte: params.minRating } }),
      ...(params.isTest && { isTest: params.isTest }),
      ...(params.cottageStatus && { cottageStatus: params.cottageStatus }),
      ...(params.status && { status: params.status }),
      ...(params.placeId && { placeId: params.placeId }),
      ...(params.regionId && { regionId: params.regionId }),
      ...(params.comforts && {
        comforts: {
          some: {
            id: {
              in: params.comforts,
            },
          },
        },
      }),
      ...(params.cottageTypes && {
        cottageTypes: {
          some: {
            id: {
              in: params.cottageTypes,
            },
          },
        },
      }),
    };

    const {sortField, sortOrder} = params

    const orderBy: Prisma.CottageOrderByWithRelationInput = sortField
      ? { [sortField]: sortOrder || 'asc' }
      : { createdAt: 'desc' };

    return {
      where: filters,
      orderBy,
    };
  }
}
