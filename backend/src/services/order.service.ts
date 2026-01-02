import mongoose from "mongoose";
import { Order } from "../models/order.model";
import { OrderType } from '../types/order.types';
import { stringify } from "querystring";

// Create a new order
export const create = async (orderData: Partial<OrderType>) => {
  return await Order.create(orderData);
};

// Find a single order by query
export const findByQuery = async (query: Partial<OrderType>) => {
  return await Order.findOne(query as mongoose.FilterQuery<OrderType>);
};

// Update an order by ID
export const update = async (id: mongoose.Types.ObjectId, updateData: Partial<OrderType>) => {
  return await Order.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

// List orders with pagination and filtering
export const list = async (
  skip: number | null,
  limit: number | null,
  filter: any = {},
  includes: string[] = [],
) => {
  let aggregationQuery: any[] = [];
  const search = filter?.search?.trim() || null;
  const sortOrder = filter?.sort

  if (sortOrder) delete filter.sort;

  if (search) delete filter.search;

  aggregationQuery.push({
    $match: { is_deleted: false },
  });

  if (filter?.status) {
    aggregationQuery.push({
      $match: { status: filter.status },
    });
    delete filter.status;
  }

  if (filter && Object.keys(filter).length > 0) {
    aggregationQuery.push({ $match: filter });
  }
  if (includes.length > 0) {
    includes.forEach((include) => {
      switch (include) {
        case 'user':
          aggregationQuery.push(
            {
              $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
              },
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
          );
          break;

        case 'product':
          aggregationQuery.push(
            { $unwind: { path: '$ordered_items', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'products',
                localField: 'ordered_items.product_id',
                foreignField: '_id',
                as: 'ordered_items.product',
              },
            },
            { $unwind: { path: '$ordered_items.product', preserveNullAndEmptyArrays: true } },
            {
              $group: {
                _id: '$_id',
                doc: { $first: '$$ROOT' },
                ordered_items: { $push: '$ordered_items' },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ['$doc', { ordered_items: '$ordered_items' }],
                },
              },
            }
          );
          break;
      }
    });
  }

  if (sortOrder) {
    aggregationQuery.push({
      $sort: sortOrder,
    });
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    aggregationQuery.push({
      $match: {
        $or: [
          { order_id: Number(search) },
          { 'user.name': searchRegex },
          { 'ordered_items.product.name': searchRegex },
        ],
      },
    });
  }

  const dataPipeline = [...aggregationQuery];

  if (skip !== null && limit !== null) {
    dataPipeline.push({
      $skip: skip,
    });
    dataPipeline.push({
      $limit: limit,
    });
  }

  aggregationQuery.push({
    $facet: {
      data: dataPipeline,
      totalCount: [{ $count: 'total' }],
    },
  });

  aggregationQuery.push({
    $project: {
      data: 1,
      totalCount: { $ifNull: [{ $arrayElemAt: ['$totalCount.total', 0] }, 0] },
    },
  });

  const result = await Order.aggregate(aggregationQuery);

  return result[0] || { data: [], totalCount: 0 };
};

export default {
  create,
  findByQuery,
  list,
  update,
}