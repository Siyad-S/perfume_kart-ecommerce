import mongoose from 'mongoose';
import { Payment } from '../models/payment.model';
import { PaymentType } from '../types/payment.types';

// Create a new payment
export const create = async (paymentData: Partial<PaymentType>) => {
    return await Payment.create(paymentData);
};

// Find a single payment by query
export const findByQuery = async (query: Partial<PaymentType>) => {
    return await Payment.findOne(query as mongoose.FilterQuery<PaymentType>);
};

// List all payments
export const list = async (
    skip: number | null,
    limit: number | null,
    filter: any = {},
    includes: string[] = [],
) => {
    let aggregationQuery: any[] = [];
    const search = filter?.search?.trim() || null;

    if (search) delete filter.search;

    aggregationQuery.push({
        $match: { is_deleted: false },
    });

    if (filter?.payment_status) {
        aggregationQuery.push({
            $match: { payment_status: filter.payment_status },
        });
        delete filter.payment_status;
    }

    if (filter?.sort) {
        aggregationQuery.push({
            $sort: filter.sort,
        });
        delete filter.sort;
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

    const dataPipeline = [...aggregationQuery];
    if (skip !== null && limit !== null) {
        dataPipeline.push({ $skip: skip });
        dataPipeline.push({ $limit: limit });
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

    const result = await Payment.aggregate(aggregationQuery);

    return result[0] || { data: [], totalCount: 0 };
};

// Update a payment
export const update = async (id: mongoose.Types.ObjectId, updateData: Partial<PaymentType>) => {
    return await Payment.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

export default {
    create,
    findByQuery,
    list,
    update,
}