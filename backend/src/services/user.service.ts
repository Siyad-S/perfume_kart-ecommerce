import User from '../models/user.model';
import { UserType, LoginRegisterType } from '../types/user.types';
import mongoose from 'mongoose';

// Create user
const createUser = async (userData: LoginRegisterType) => {
  return await User.create(userData);
};

// Find user
const findByQuery = async (query: Partial<UserType>) => {
  const result = await User.aggregate([
    { $match: query as mongoose.FilterQuery<UserType> },
    {
      $lookup: {
        from: "products",
        localField: "cart.product_id",
        foreignField: "_id",
        as: "cartProducts"
      }
    },
    {
      $addFields: {
        cart: {
          $map: {
            input: "$cart",
            as: "c",
            in: {
              $mergeObjects: [
                "$$c",
                {
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$cartProducts",
                          as: "p",
                          cond: { $eq: ["$$p._id", "$$c.product_id"] }
                        }
                      },
                      0
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    },
    { $project: { cartProducts: 0 } }
  ]);
  return result[0] || null;
};

// List all users
const list = async (
  skip: number,
  limit: number,
  filter: any = {},
  includes: string[] = []
) => {
  let aggregationQuery: any[] = [];
  const search = filter?.search?.trim() || null;
  if (search) {
    aggregationQuery.push({
      $match: {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  const { search: _search, sort: _sort, ...restFilter } = filter || {};

  aggregationQuery.push({
    $match: {
      is_deleted: false,
      ...restFilter
    },
  });

  if (filter?.sort) {
    aggregationQuery.push({
      $sort: filter?.sort,
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

  if (includes.length > 0) {
    includes.forEach((include) => {
      switch (include) {
        case 'cartProducts':
          dataPipeline.push(
            {
              $lookup: {
                from: "products",
                localField: "cart.product_id",
                foreignField: "_id",
                as: "cartProducts"
              }
            },
            {
              $addFields: {
                cart: {
                  $map: {
                    input: "$cart",
                    as: "c",
                    in: {
                      $mergeObjects: [
                        "$$c",
                        {
                          product: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$cartProducts",
                                  as: "p",
                                  cond: { $eq: ["$$p._id", "$$c.product_id"] }
                                }
                              },
                              0
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            { $project: { cartProducts: 0 } }
          );
          break
        case 'wishlist':
          dataPipeline.push(
            {
              $lookup: {
                from: "products",
                localField: "wishlist.product_id",
                foreignField: "_id",
                as: "wishlistProducts"
              }
            },
            {
              $addFields: {
                wishlist: {
                  $map: {
                    input: "$wishlist",
                    as: "w",
                    in: {
                      $mergeObjects: [
                        "$$w",
                        {
                          product: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$wishlistProducts",
                                  as: "p",
                                  cond: { $eq: ["$$p._id", "$$w.product_id"] }
                                }
                              },
                              0
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            { $project: { wishlistProducts: 0 } }
          );
          break;
      }
    })
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
      totalCount: { $arrayElemAt: ['$totalCount.total', 0] },
    },
  });

  return await User.aggregate(aggregationQuery);

};

// Update user
const update = async (id: mongoose.Types.ObjectId, updateData: any) => {
  await User.findByIdAndUpdate(id, updateData, { new: true }).exec();

  const result = await User.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: "products",
        localField: "cart.product_id",
        foreignField: "_id",
        as: "cartProducts"
      }
    },
    {
      $addFields: {
        cart: {
          $map: {
            input: "$cart",
            as: "c",
            in: {
              $mergeObjects: [
                "$$c",
                {
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$cartProducts",
                          as: "p",
                          cond: { $eq: ["$$p._id", "$$c.product_id"] }
                        }
                      },
                      0
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    },
    { $project: { cartProducts: 0 } }
  ]);

  return result[0] || null;
};

export default {
  createUser,
  findByQuery,
  list,
  update,
};