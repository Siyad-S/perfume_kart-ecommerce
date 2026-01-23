import { NextFunction, Request, Response } from "express";
import { responseFormatter } from '../utils/responseFormatter';
import * as Category from '../services/category.service';
import { CategoryType } from '../types/category.types';
import { ListRequestType } from '../types/common.types';
import * as Brand from '../services/brand.service';
import * as Product from '../services/product.service';
import mongoose from "mongoose";
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

//create category
export const create = catchAsync(async (
    req: Request<{}, {}, Partial<CategoryType>>,
    res: Response,
    next: NextFunction,
) => {
    const { name, description, image_url } = req.body
    const category = await Category.createCategory({
        name,
        description,
        image_url,
    });
    return responseFormatter(res, category, 'Category created', 201);
});

//list category
export const list = catchAsync(async (
    req: Request<{}, {}, Partial<ListRequestType>>,
    res: Response,
    next: NextFunction,
) => {
    const { search, skip, limit, sort, filter = {} } = req.body;

    (filter as { is_deleted: boolean }).is_deleted = false;
    let listSort: object = { createdAt: -1 };
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
    // const includes = []
    // const projectArray = []
    const categories = await Category.list(
        skip || null,
        limit || null,
        filter,
    );
    return responseFormatter(res, categories, 'Category list', 200);
});

//get category
export const category = catchAsync(async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const category = await Category.list(0, 1, { _id: id });
    const categoryData = category[0]?.data?.[0];
    if (categoryData) {
        return responseFormatter(res, categoryData, 'Category fetched success!', 200);
    } else {
        return next(new AppError('Category not found!', 404));
    }
});

// update category
export const update = catchAsync(async (
    req: Request<{ id: string }, {}, Partial<CategoryType>>,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    const category = await Category.update(id, {
        name,
        description,
        image_url
    });
    return responseFormatter(res, category, 'Category updated', 200);
});

// delete category
export const deleteCategory = catchAsync(async (
    req: Request<{ id: string }, {}, Partial<CategoryType>>,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const isExists = await Category.findByQuery({
        _id: new mongoose.Types.ObjectId(id),
        is_deleted: false
    });
    if (!isExists) {
        return next(new AppError('Category not found', 404));
    }

    const category = await Category.update(id, {
        is_deleted: true,

    });
    return responseFormatter(res, category, 'Category deleted', 200);
});

export const getMegaMenu = catchAsync(async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction,
) => {
    const categories = await Category.list(0, 5, {
        is_deleted: false,
        sort: { createdAt: -1 },
    });

    const brands = await Brand.megaMenuBrands()

    const bestSellers = await Product.list(0, 4, {
        is_deleted: false,
        sort: { createdAt: -1 },
    }, ['category', 'brand']);

    return responseFormatter(res, {
        categories: categories.data,
        brands: brands,
        bestSellers: bestSellers.data
    }, 'Mega menu categories', 200);
});