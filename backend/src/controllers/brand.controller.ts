import { NextFunction, Request, Response } from "express";
import { responseFormatter } from '../utils/responseFormatter';
import * as Brand from '../services/brand.service';
import { BrandType } from '../types/brand.types';
import { ListRequestType } from '../types/common.types';
import mongoose from "mongoose";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";

// Create brand
export const create = catchAsync(async (
    req: Request<{}, {}, Partial<BrandType>>,
    res: Response,
    next: NextFunction
) => {
    const { name, description, origin, logo_url } = req.body;

    const brandData: Partial<BrandType> = {
        name,
        description,
        origin,
        logo_url,
    };

    const brand = await Brand.createBrand(brandData);

    return responseFormatter(res, brand, "Brand created", 201);
});

// List brand
export const list = catchAsync(async (
    req: Request<{}, {}, Partial<ListRequestType>>,
    res: Response,
    next: NextFunction
) => {
    const { search, skip, limit, sort, filter = {} } = req.body;
    (filter as { is_deleted: boolean }).is_deleted = false;
    let listSort: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
        switch (sort) {
            case 'name_asc':
                listSort = { name: 1 };
                break;
            case 'name_desc':
                listSort = { name: -1 };
                break;
            case 'createdAt_asc':
                listSort = { createdAt: 1 };
                break;
            case 'createdAt_desc':
                listSort = { createdAt: -1 };
                break;
            default:
                listSort = { createdAt: -1 };
                break;
        }
    }

    (filter as { sort: object }).sort = listSort;
    if (search) {
        (filter as { search: string }).search = search;
    }
    const brandList = await Brand.list(Number(skip) || null, Number(limit) || null, filter);
    if (!brandList.data || brandList.data.length === 0) {
        return responseFormatter(res, [], 'Brands list is empty!', 200);
    } else {
        return responseFormatter(res, brandList, 'Brands listed successfully!', 200);
    }
});

// Update brand
export const update = catchAsync(async (
    req: Request<{ id: string }, {}, Partial<BrandType>>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const isExists = await Brand.findByQuery({
        _id: new mongoose.Types.ObjectId(id),
        is_deleted: false,
    });

    if (!isExists) {
        return next(new AppError("Brand not found", 404));
    }

    const { name, description, origin, logo_url } = req.body;

    const updateData: Partial<BrandType> = {
        name,
        description,
        origin,
        logo_url,

    };

    if (Object.keys(updateData).length === 0) {
        return next(new AppError("No changes provided", 404));
    }

    const brand = await Brand.update(id, updateData);

    return responseFormatter(res, brand, "Brand updated", 200);
});

// Delete brand
export const deleteBrand = catchAsync(async (
    req: Request<{ id: string }, {}, Partial<BrandType>>,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const isExists = await Brand.findByQuery({
        _id: new mongoose.Types.ObjectId(id),
        is_deleted: false
    });

    if (!isExists) {
        return next(new AppError('Brand not found', 404));
    }
    const brand = await Brand.update(id, {
        is_deleted: true,

    });
    return responseFormatter(res, brand, 'Brand deleted', 200);
});