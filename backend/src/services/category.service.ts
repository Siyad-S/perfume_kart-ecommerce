import mongoose from 'mongoose';
import Category from '../models/category.model';
import { CategoryType } from '../types/category.types';

//Create a new category
export const createCategory = async (categoryData: Partial<CategoryType>) => {
  return await Category.create(categoryData);
};

//Find a single category by query
export const findByQuery = async (query: Partial<CategoryType>) => {
  return await Category.findOne(query as mongoose.FilterQuery<CategoryType>);
};

//Find all categories by query
export const list = async (
  skip: number | null,
  limit: number | null,
  filter: any = {},
) => {
  let aggregationQuery: any[] = [];
  const search = filter?.search?.trim() || null;
  if (search) {
    aggregationQuery.push({
      $match: {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          // { description: { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  aggregationQuery.push({
    $match: {
      is_deleted: false,
    },
  });

  if (filter?.sort) {
    aggregationQuery.push({
      $sort: filter?.sort,
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

  const result = await Category.aggregate(aggregationQuery);

  // Return the result, handling the case where no documents are found
  return result[0] || { data: [], totalCount: 0 };
};

//Update a category by ID
export const update = async (id: string, updateData: Partial<CategoryType>) => {
  return await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};
