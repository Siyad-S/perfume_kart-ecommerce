import mongoose from 'mongoose';
import Brand from '../models/brand.model';
import { BrandType } from '../types/brand.types';

//Create a new brand
export const createBrand = async (brandData: Partial<BrandType>) => {
  return await Brand.create(brandData);
};

//find single brand by query
export const findByQuery = async (query: Partial<BrandType>) => {
  return await Brand.findOne(query as mongoose.FilterQuery<BrandType>);
};

//List all brands
export const list = async (
  skip: number | null,
  limit: number | null,
  filter: any = {}
) => {
  let aggregationQuery: any[] = [];
  const search = filter?.search?.trim() || null;

  // Apply search filter
  if (search) {
    aggregationQuery.push({
      $match: {
        $or: [{ name: { $regex: search, $options: 'i' } }],
      },
    });
  }

  // Apply is_deleted filter
  aggregationQuery.push({
    $match: {
      is_deleted: false,
    },
  });

  // Apply sorting
  if (filter?.sort) {
    aggregationQuery.push({
      $sort: filter.sort,
    });
  }

  // Create a copy of the pipeline up to this point for the data facet
  const dataPipeline = [...aggregationQuery];

  // Add skip and limit for pagination in the data pipeline
  if (skip !== null && limit !== null) {
    dataPipeline.push({
      $skip: skip,
    });
    dataPipeline.push({
      $limit: limit,
    });
  }

  // Add facet stage for pagination and total count
  aggregationQuery.push({
    $facet: {
      data: dataPipeline, // Use the data pipeline with skip and limit
      totalCount: [{ $count: 'total' }], // Calculate total count
    },
  });

  // Project the results to extract total count
  aggregationQuery.push({
    $project: {
      data: 1,
      totalCount: { $arrayElemAt: ['$totalCount.total', 0] },
    },
  });

  const result = await Brand.aggregate(aggregationQuery);

  // Return the result, handling the case where no documents are found
  return result[0] || { data: [], totalCount: 0 };
};

// update brand
export const update = async (id: string, brandData: Partial<BrandType>) => {
  return await Brand.findByIdAndUpdate(id, brandData, {
    new: true,
  });
};

export const megaMenuBrands = async () => {
  const aggregationQuery = await Brand.aggregate([
    {
      $match: {
        is_deleted: false,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 6,
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'brand_id',
        as: 'products',
        pipeline: [
          {
            $match: {
              is_deleted: false,
            },
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $limit: 3,
          },
          {
            $project: {
              _id: 1,
              name: 1,
              image: { $arrayElemAt: ["$image_urls", 0] }
            }
          }
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        products: 1,
        image_url: 1
      }
    }
  ])
  return aggregationQuery
}