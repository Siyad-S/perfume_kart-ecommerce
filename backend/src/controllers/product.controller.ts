import { Request, Response, NextFunction } from 'express';
import { responseFormatter } from '../utils/responseFormatter';
import * as Product from '../services/product.service';
import { ListRequestType } from '../types/common.types';
import { ProductType } from '../types/product.types';
import mongoose from 'mongoose';

// create product
export const createProduct = async (
  req: Request<{}, {}, Partial<ProductType>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      name,
      description,
      brand_id,
      price,
      discount_price,
      stock_quantity,
      sku,
      notes,
      image_urls,
      tags,
      banner_url,
      category_id,
      best_seller,
      trending,
      new_launch,
    } = req.body;
    const product = await Product.createProduct({
      name,
      description,
      brand_id,
      price,
      discount_price,
      stock_quantity,
      sku,
      notes: {
        top: notes?.top || [],
        middle: notes?.middle || [],
        base: notes?.base || [],
      },
      image_urls: image_urls || [],
      tags: tags || [],
      banner_url,
      category_id,
      best_seller,
      trending,
      new_launch,
    });
    responseFormatter(res, product, 'Product created successfully', 201);
  } catch (error) {
    responseFormatter(res, null, 'Failed to create product', 500);
  }
};

//product list
export const list = async (
  req: Request<{}, {}, ListRequestType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      search,
      skip = null,
      limit = null,
      sort,
      filter = {},
    } = req.body;
    let listSort: object = { created_at: -1 };
    if (sort) {
      switch (sort) {
        case 'name_asc':
          listSort = { name: 1 };
          break;
        case 'name_desc':
          listSort = { name: -1 };
          break;
        case 'price_asc':
          listSort = { price: 1 };
          break;
        case 'price_desc':
          listSort = { price: -1 };
          break;
        case 'discount_price_asc':
          listSort = { discount_price: 1 };
          break;
        case 'discount_price_desc':
          listSort = { discount_price: -1 };
          break;
        case 'stock_quantity_asc':
          listSort = { stock_quantity: 1 };
          break;
        case 'stock_quantity_desc':
          listSort = { stock_quantity: -1 };
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

    if (filter?.category_id) {
      (filter as { category_id: mongoose.Types.ObjectId }).category_id = new mongoose.Types.ObjectId(filter.category_id);
    }

    if (filter?.brand_id) {
      (filter as { brand_id: mongoose.Types.ObjectId }).brand_id = new mongoose.Types.ObjectId(filter.brand_id);
    }

    if (filter?.brand && filter.brand.length > 0) {
      (filter as { brand: mongoose.Types.ObjectId[] }).brand = filter.brand.map((brand) => new mongoose.Types.ObjectId(brand));
    }

    if (filter?.price) {
      (filter as { price: { min: number, max: number } }).price = {
        min: filter.price.min,
        max: filter.price.max,
      }
    }

    const includes = ['category', 'brand'];
    // const projectArray = []

    const products = await Product.list(skip, limit, filter, includes);

    responseFormatter(res, products, 'Products fetched success!', 200);

  } catch (error) {
    responseFormatter(res, null, 'Failed to create product', 500);
  }
};

// find one product
export const product = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const productId = new mongoose.Types.ObjectId(id)
    const isExists = await Product.findByQuery({
      _id: productId,
      is_deleted: false
    });

    if (!isExists) {
      return responseFormatter(res, null, 'Product not found', 404);
    }

    const result = await Product.list(0, 1, { _id: productId }, ['category', 'brand']);

    const productData = result;

    responseFormatter(res, productData, 'Product fetched success!', 200);
  } catch (error) {
    console.error('Product fetching Error:', error);
    responseFormatter(res, null, 'Product fetching failed', 500);
  }
}

// update product
export const updateProduct = async (
  req: Request<{ id: string }, {}, Partial<ProductType>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const isExists = await Product.findByQuery({
      _id: new mongoose.Types.ObjectId(id),
      is_deleted: false
    });

    if (!isExists) {
      return responseFormatter(res, null, 'Product not found', 404);
    }

    const {
      name,
      description,
      brand_id,
      price,
      discount_price,
      stock_quantity,
      sku,
      notes,
      image_urls,
      tags,
      banner_url,
      category_id,
      best_seller,
      trending,
      new_launch,
    } = req.body;
    const product = await Product.update(id, {
      name,
      description,
      brand_id,
      price,
      discount_price,
      stock_quantity,
      sku,
      notes: {
        top: notes?.top || [],
        middle: notes?.middle || [],
        base: notes?.base || [],
      },
      image_urls: image_urls || [],
      tags: tags || [],
      banner_url,
      category_id,
      best_seller,
      trending,
      new_launch,
    });

    responseFormatter(res, product, 'Product updated successfully', 200);
  } catch (error) {
    console.error('Product update error:', error);
    responseFormatter(res, null, 'Failed to update product', 500);
  }
};


//delete product
export const deleteProduct = async (
  req: Request<{ id: string }, {}, Partial<ProductType>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const isExists = await Product.findByQuery({
      _id: new mongoose.Types.ObjectId(id),
      is_deleted: false
    });

    if (!isExists) {
      return responseFormatter(res, null, 'Product not found', 404);
    }

    const product = await Product.update(id, {
      is_deleted: true,
      updated_at: new Date(),
    });
    responseFormatter(res, product, 'Product deleted successfully', 200);
  } catch (error) {
    console.error('Product delete error:', error);
    responseFormatter(res, null, 'Failed to delete product', 500);
  }
};

//global search
export const globalSearch = async (
  req: Request<{}, {}, ListRequestType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      search,
      skip = null,
      limit = null,
      filter = {},
    } = req.body;
    filter.search = search;
    (filter as { sort: object }).sort = { name: 1 };
    const products = await Product.list(skip, limit, filter, ['category', 'brand']);
    responseFormatter(res, products, 'Products fetched successfully', 200);
  } catch (error) {
    responseFormatter(res, null, 'Failed to search products', 500);
  }
}