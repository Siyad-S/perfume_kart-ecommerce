import { BannerType } from "@/types/banner.types";
import * as Banner from "@/services/banner.service";
import { NextFunction, Request, Response } from "express";
import { responseFormatter } from "@/utils/responseFormatter";
import mongoose from "mongoose";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";

// create banner
export const create = catchAsync(async (
    req: Request<{}, {}, Partial<BannerType>>,
    res: Response,
    next: NextFunction
) => {
    const { banner_url,
        product_id,
        category_id,
        home_slider,
        home_sub,
        category_listing,
        banner_text,
        description,
    } = req.body;

    const bannerData: Partial<BannerType> = {
        banner_url,
        product_id,
        category_id,
        banner_text,
        description,
        home_slider,
        home_sub,
        category_listing,
    };

    const banner = await Banner.create(bannerData);

    return responseFormatter(res, banner, "Banner created", 201);
});

// List banners
export const list = catchAsync(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { search, skip, limit, sort, filter = {} } = req.body;

    (filter as { is_deleted: boolean }).is_deleted = false;
    let listSort: Record<string, 1 | -1> = { createdAt: -1 };

    if (sort) {
        switch (sort) {
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

    const includes = ['category', 'product'];
    // const projectArray = []

    const bannerList = await Banner.list(skip || null, limit || null, filter, includes);

    return responseFormatter(res, bannerList, "Banner listing success", 200);
});

// Get one banner
export const banner = catchAsync(async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    const isExists = await Banner.findByQuery({
        _id: new mongoose.Types.ObjectId(id),
        is_deleted: false
    });

    if (!isExists) {
        return next(new AppError('Banner not found', 404));
    }

    const result = await Banner.list(0, 1, { _id: id })

    const banner = result;

    return responseFormatter(res, banner, "Banner found", 200);
});

// update banner
export const update = catchAsync(async (
    req: Request<{ id: string }, {}, Partial<BannerType>>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { banner_url,
        product_id,
        category_id,
        home_slider,
        home_sub,
        category_listing,
        banner_text,
        description
    } = req.body;

    const isExists = await Banner.findByQuery({
        _id: new mongoose.Types.ObjectId(id),
        is_deleted: false
    });

    if (!isExists) {
        return next(new AppError('Banner not found', 404));
    }

    const bannerData: Partial<BannerType> = {
        banner_url,
        product_id,
        category_id,
        banner_text,
        description,
        home_slider,
        home_sub,
        category_listing,
    };

    const banner = await Banner.update(id, bannerData);

    return responseFormatter(res, banner, "Banner updated", 200);
});

//delete banner
export const deleteBanner = catchAsync(async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    const isExists = await Banner.findByQuery({
        _id: new mongoose.Types.ObjectId(id),
        is_deleted: false
    });

    if (!isExists) {
        return next(new AppError('Banner not found', 404));
    }

    const banner = await Banner.update(id, { is_deleted: true });

    return responseFormatter(res, banner, "Banner deleted", 200);
});