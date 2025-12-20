import mongoose from 'mongoose';
import { Payment } from '../models/payment.model';
import { PaymentType } from '../types/payment.types';

// 🧩 Create a new payment
export const create = async (paymentData: Partial<PaymentType>) => {
    return await Payment.create(paymentData);
};

// 🔍 Find a single payment by query
export const findByQuery = async (query: Partial<PaymentType>) => {
    return await Payment.findOne(query as mongoose.FilterQuery<PaymentType>);
};

// 📋 List all payments with pagination, filtering, and optional includes (user/order)
export const list = async (
    skip: number | null,
    limit: number | null,
    filter: any = {},
    includes: string[] = [],
) => {
    let aggregationQuery: any[] = [];
    const search = filter?.search?.trim() || null;

    // Remove search to avoid redundancy
    if (search) delete filter.search;

    // Always exclude deleted payments
    aggregationQuery.push({
        $match: { is_deleted: false },
    });

    // Filter by payment_status (if provided)
    if (filter?.payment_status) {
        aggregationQuery.push({
            $match: { payment_status: filter.payment_status },
        });
        delete filter.payment_status;
    }

    // Apply sorting
    if (filter?.sort) {
        aggregationQuery.push({
            $sort: filter.sort,
        });
        delete filter.sort;
    }

    console.log("filter77777777777", filter);


    // Apply generic filters if any left
    if (filter && Object.keys(filter).length > 0) {
        aggregationQuery.push({ $match: filter });
    }

    // Handle $lookup for includes (user, order)
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

                case 'order':
                    aggregationQuery.push(
                        {
                            $lookup: {
                                from: 'orders',
                                localField: 'order_id',
                                foreignField: '_id',
                                as: 'order',
                            },
                        },
                        { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
                    );
                    break;
            }
        });
    }

    // 🔎 Apply search
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        aggregationQuery.push({
            $match: {
                $or: [
                    { 'razorpay.order_id': { $regex: searchRegex } },
                    { 'razorpay.payment_id': { $regex: searchRegex } },
                    ...(includes.includes('user')
                        ? [{ 'user.name': { $regex: searchRegex } }]
                        : []),
                ],
            },
        });
    }

    // Create data pipeline for pagination
    const dataPipeline = [...aggregationQuery];
    if (skip !== null && limit !== null) {
        dataPipeline.push({ $skip: skip });
        dataPipeline.push({ $limit: limit });
    }

    // Facet for total count and paginated data
    aggregationQuery.push({
        $facet: {
            data: dataPipeline,
            totalCount: [{ $count: 'total' }],
        },
    });

    // Project data and total count
    aggregationQuery.push({
        $project: {
            data: 1,
            totalCount: { $ifNull: [{ $arrayElemAt: ['$totalCount.total', 0] }, 0] },
        },
    });

    const result = await Payment.aggregate(aggregationQuery);

    return result[0] || { data: [], totalCount: 0 };
};

// 🔄 Update a payment by ID
export const update = async (id: mongoose.Types.ObjectId, updateData: Partial<PaymentType>) => {
    return await Payment.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

export default {
    create,
    findByQuery,
    list,
    update,
}