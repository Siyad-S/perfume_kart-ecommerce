import mongoose from 'mongoose';
import Product from '../models/product.model';
import { ProductType } from '../types/product.types';

// Create a new product
export const createProduct = async (productData: Partial<ProductType>) => {
  return await Product.create(productData);
};

// Find a single product by query
export const findByQuery = async (query: Partial<ProductType>) => {
  return await Product.findOne(query as mongoose.FilterQuery<ProductType>);
};

// List all products with pagination, filtering, and includes
export const list = async (
  skip: number | null,
  limit: number | null,
  filter: any = {},
  includes: string[] = [],
) => {
  let aggregationQuery: any[] = [];
  const search = filter?.search?.trim() || null;

  // Remove search from filter to avoid redundant processing
  if (search) delete filter.search;

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
  delete filter.sort;

  if (filter?.brand?.length > 0) {
    aggregationQuery.push({
      $match: {
        brand_id: {
          $in: filter.brand,
        }
      }
    })
  }
  delete filter.brand;

  if (filter?.price) {
    aggregationQuery.push({
      $match: {
        price: {
          $gte: filter.price.min,
          $lte: filter.price.max,
        }
      }
    })
  }
  delete filter.price;

  // Apply filter if it exists
  if (filter && Object.keys(filter).length > 0) {
    aggregationQuery.push({ $match: filter });
  }

  // Handle $lookup and $unwind for includes (category, brand)
  if (includes.length > 0) {
    includes.forEach((include) => {
      switch (include) {
        case 'category':
          aggregationQuery.push(
            {
              $lookup: {
                from: 'categories',
                localField: 'category_id',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
            },
          );
          break;
        case 'brand':
          aggregationQuery.push(
            {
              $lookup: {
                from: 'brands',
                localField: 'brand_id',
                foreignField: '_id',
                as: 'brand',
              },
            },
            {
              $unwind: { path: '$brand', preserveNullAndEmptyArrays: true },
            },
          );
          break;
      }
    });
  }

  // Apply search filter if search term exists
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    aggregationQuery.push({
      $match: {
        $or: [
          { name: { $regex: searchRegex } },
          { notes: { $elemMatch: { $regex: searchRegex } } },
          ...(includes.includes('brand')
            ? [{ 'brand.name': { $regex: searchRegex } }]
            : []),
          ...(includes.includes('category')
            ? [{ 'category.name': { $regex: searchRegex } }]
            : []),
        ],
      },
    });
  }

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

  const result = await Product.aggregate(aggregationQuery);

  // Return the result, handling the case where no documents are found
  return result[0] || { data: [], totalCount: 0 };
};

// Update a product by ID
export const update = async (id: string, updateData: Partial<ProductType>) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true }).exec();
};
