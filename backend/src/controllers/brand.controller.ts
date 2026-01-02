import { NextFunction, Request, Response } from "express";
import { responseFormatter } from '../utils/responseFormatter';
import * as Brand from '../services/brand.service';
import { BrandType } from '../types/brand.types';
import { ListRequestType } from '../types/common.types';
import mongoose from "mongoose";

// Create brand
export const create = async (
    req: Request<{}, {}, Partial<BrandType>>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description, origin, logo_url } = req.body;

        const brandData: Partial<BrandType> = {
            name,
            description,
            origin,
            logo_url,
        };

        const brand = await Brand.createBrand(brandData);

        return responseFormatter(res, brand, "Brand created", 201);
    } catch (error) {
        console.error("Brand Creation Error:", error);

        if (error instanceof mongoose.Error) {
            return responseFormatter(res, null, "Database error during brand creation", 500);
        }
        return responseFormatter(res, null, "Brand creation failed", 500);
    }
};

// List brand
export const list = async (
    req: Request<{}, {}, Partial<ListRequestType>>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { search, skip, limit, sort, filter = {} } = req.body;
        (filter as { is_deleted: boolean }).is_deleted = false;
        let listSort: Record<string, 1 | -1> = { created_at: -1 };
        if (sort) {
            switch (sort) {
                case 'name_asc':
                    listSort = { name: 1 };
                    break;
                case 'name_desc':
                    listSort = { name: -1 };
                    break;
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
        const brandList = await Brand.list(Number(skip) || null, Number(limit) || null, filter);
        if (!brandList.data || brandList.data.length === 0) {
            return responseFormatter(res, [], 'Brands list is empty!', 200);
        } else {
            return responseFormatter(res, brandList, 'Brands listed successfully!', 200);
        }
    } catch (error) {
        console.error('Brand List Error:', error);
        return responseFormatter(res, null, 'Brand list failed', 500);
    }
};

// Update brand
export const update = async (
    req: Request<{ id: string }, {}, Partial<BrandType>>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const isExists = await Brand.findByQuery({
            _id: new mongoose.Types.ObjectId(id),
            is_deleted: false,
        });

        if (!isExists) {
            return responseFormatter(res, null, "Brand not found", 404);
        }

        const { name, description, origin, logo_url } = req.body;

        const updateData: Partial<BrandType> = {
            name,
            description,
            origin,
            logo_url,
            updated_at: new Date(),
        };

        if (Object.keys(updateData).length === 0) {
            return responseFormatter(res, isExists, "No changes provided", 400);
        }

        const brand = await Brand.update(id, updateData);

        return responseFormatter(res, brand, "Brand updated", 200);
    } catch (error) {
        console.error("Brand Update Error:", error);

        if (error instanceof mongoose.Error) {
            return responseFormatter(res, null, "Database error during brand update", 500);
        }
        return responseFormatter(res, null, "Brand update failed", 500);
    }
};

// Delete brand
export const deleteBrand = async (
    req: Request<{ id: string }, {}, Partial<BrandType>>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const isExists = await Brand.findByQuery({
            _id: new mongoose.Types.ObjectId(id),
            is_deleted: false
        });

        if (!isExists) {
            return responseFormatter(res, null, 'Brand not found', 404);
        }
        const brand = await Brand.update(id, {
            is_deleted: true,
            updated_at: new Date(),
        });
        return responseFormatter(res, brand, 'Brand deleted', 200);
    } catch (error) {
        console.error('Brand Delete Error:', error);
        return responseFormatter(res, null, 'Brand delete failed', 500);
    }
};