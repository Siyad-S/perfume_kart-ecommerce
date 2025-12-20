import mongoose from 'mongoose';
import Banner from '@/models/banner.model';
import { BannerType } from '@/types/banner.types';

//create new banner
export const create = async (data: Partial<BannerType>) => {
    return await Banner.create(data);
};

//find single banner by query
export const findByQuery = async (query: Partial<BannerType>) => {
    return await Banner.findOne(query as mongoose.FilterQuery<BannerType>);
};

//List all banners
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

    // Apply filter if it exists
    if (filter && Object.keys(filter).length > 0) {
        aggregationQuery.push({ $match: filter });
    }

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
                case 'product':
                    aggregationQuery.push(
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'product_id',
                                foreignField: '_id',
                                as: 'product',
                            },
                        },
                        {
                            $unwind: { path: '$product', preserveNullAndEmptyArrays: true },
                        },
                    );
                    break;
            }

        });
    }

    if (search) {
        const searchConditions: any[] = [];

        if (includes.includes("category")) {
            searchConditions.push({ "category.name": { $regex: search, $options: "i" } });
        }

        if (includes.includes("product")) {
            searchConditions.push({ "product.name": { $regex: search, $options: "i" } });
        }

        if (searchConditions.length > 0) {
            aggregationQuery.push({ $match: { $or: searchConditions } });
        }
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

    const result = await Banner.aggregate(aggregationQuery);

    return result[0] || { data: [], totalCount: 0 };
};

// update bannerl̥
export const update = async (id: string, bannerData: Partial<BannerType>) => {
    return await Banner.findByIdAndUpdate(id, bannerData, {
        new: true,
    });
};