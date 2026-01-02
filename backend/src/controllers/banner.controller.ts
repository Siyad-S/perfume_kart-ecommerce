import { BannerType } from "@/types/banner.types";
import * as Banner from "@/services/banner.service";
import { NextFunction, Request, Response } from "express";
import { responseFormatter } from "@/utils/responseFormatter";
import mongoose from "mongoose";

// create banner
export const create = async (
    req: Request<{}, {}, Partial<BannerType>>,
    res: Response,
    next: NextFunction
) => {
    try {
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
    } catch (error) {
        console.error("Banner Creation Error:", error);

        if (error instanceof mongoose.Error) {
            return responseFormatter(res, null, "Database error during banner creation", 500);
        }
        return responseFormatter(res, null, "Banner creation failed", 500);
    }
}

// List banners
export const list = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { search, skip, limit, sort, filter = {} } = req.body;

        (filter as { is_deleted: boolean }).is_deleted = false;
        let listSort: Record<string, 1 | -1> = { created_at: -1 };

        if (sort) {
            switch (sort) {
                case 'created_at_asc':
                    listSort = { created_at: 1 };
                    break;
                case 'created_at_desc':
                    listSort = { created_at: -1 };
                    break;
                default:
                    listSort = { created_at: -1 };
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

    } catch (error) {
        console.error("Banner Listing Error:", error);
        return responseFormatter(res, null, "Banner listing failed", 500);
    }
}

// Get one banner
export const banner = async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const isExists = await Banner.findByQuery({
            _id: new mongoose.Types.ObjectId(id),
            is_deleted: false
        });

        if (!isExists) {
            return responseFormatter(res, null, 'Banner not found', 404);
        }

        const result = await Banner.list(0, 1, { _id: id })

        const banner = result;

        return responseFormatter(res, banner, "Banner found", 200);
    } catch (error) {
        console.error("Banner Get Error:", error);
        return responseFormatter(res, null, "Banner get failed", 500);
    }
}

// update banner
export const update = async (
    req: Request<{ id: string }, {}, Partial<BannerType>>,
    res: Response,
    next: NextFunction
) => {
    try {
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
            return responseFormatter(res, null, 'Banner not found', 404);
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
    } catch (error) {
        console.error("Banner Update Error:", error);
        return responseFormatter(res, null, "Banner update failed", 500);
    }
}

//delete banner
export const deleteBanner = async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const isExists = await Banner.findByQuery({
            _id: new mongoose.Types.ObjectId(id),
            is_deleted: false
        });

        if (!isExists) {
            return responseFormatter(res, null, 'Banner not found', 404);
        }

        const banner = await Banner.update(id, { is_deleted: true });

        return responseFormatter(res, banner, "Banner deleted", 200);
    } catch (error) {
        console.error("Banner Delete Error:", error);
        return responseFormatter(res, null, "Banner delete failed", 500);
    }
}