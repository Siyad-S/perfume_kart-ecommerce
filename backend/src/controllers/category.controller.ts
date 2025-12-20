import { NextFunction, Request, Response } from "express";
import { responseFormatter } from '../utils/responseFormatter';
import * as Category from '../services/category.service';
import { CategoryType } from '../types/category.types';
import { ListRequestType } from '../types/common.types';
import * as Brand from '../services/brand.service';
import * as Product from '../services/product.service';
import mongoose from "mongoose";

//create category
export const create = async (
    req: Request<{}, {}, Partial<CategoryType>>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name, description, image_url } = req.body
        const category = await Category.createCategory({
            name,
            description,
            image_url,
        });
        return responseFormatter(res, category, 'Category created', 201);
    } catch (error) {
        console.error('Category Creation Error:', error);
        responseFormatter(res, null, 'Category creation failed', 500);
    }
}

//list category
export const list = async (
    req: Request<{}, {}, Partial<ListRequestType>>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { search, skip, limit, sort, filter = {} } = req.body;

        (filter as { is_deleted: boolean }).is_deleted = false;
        let listSort: object = { created_at: -1 };
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
        // const includes = []
        // const projectArray = []
        const categories = await Category.list(
            skip || null,
            limit || null,
            filter,
        );
        return responseFormatter(res, categories, 'Category list', 200);
    } catch (error) {
        console.error('Category List Error:', error);
        responseFormatter(res, null, 'Category list failed', 500);
    }
}

//get category
export const category = async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const category = await Category.list(0, 1, { _id: id });
        const categoryData = category[0]?.data?.[0];
        if (categoryData) {
            return responseFormatter(res, categoryData, 'Category fetched success!', 200);
        } else {
            return responseFormatter(res, null, 'Category not found!', 404);
        }
    } catch (error) {
        console.error('Category Fetch Error:', error);
        responseFormatter(res, null, 'Category fetch failed', 500);
    }
}

// update category
export const update = async (
    req: Request<{ id: string }, {}, Partial<CategoryType>>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const { name, description, image_url } = req.body;
        const category = await Category.update(id, {
            name,
            description,
            image_url
        });
        return responseFormatter(res, category, 'Category updated', 200);
    } catch (error) {
        console.error('Category Update Error:', error);
        responseFormatter(res, null, 'Category update failed', 500);
    }
}

// delete category
export const deleteCategory = async (
    req: Request<{ id: string }, {}, Partial<CategoryType>>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const isExists = await Category.findByQuery({
            _id: new mongoose.Types.ObjectId(id),
            is_deleted: false
        });
        if (!isExists) {
            return responseFormatter(res, null, 'Category not found', 404);
        }

        const category = await Category.update(id, {
            is_deleted: true,
            updated_at: new Date(),
        });
        return responseFormatter(res, category, 'Category deleted', 200);
    } catch (error) {
        console.error('Category Delete Error:', error);
        responseFormatter(res, null, 'Category delete failed', 500);
    }
}

export const getMegaMenu = async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const categories = await Category.list(0, 5, {
            is_deleted: false,
            sort: { created_at: -1 },
        });

        const brands = await Brand.megaMenuBrands()

        const bestSellers = await Product.list(0, 4, {
            is_deleted: false,
            sort: { created_at: -1 },
        }, ['category', 'brand']);

        console.log("data", { categories, brands, bestSellers });

        return responseFormatter(res, {
            categories: categories.data,
            brands: brands,
            bestSellers: bestSellers.data
        }, 'Mega menu categories', 200);
    } catch (error) {
        console.error('Mega Menu List Error:', error);
        responseFormatter(res, null, 'Mega menu list failed', 500);
    }
}