import {supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {CreateCategoryRequest, CreateProductRequest, UpdateCategoryRequest, UpdateProductRequest} from './types';

export class MenuService {
    static async createCategory(data: CreateCategoryRequest) {
        const {data: category, error} = await supabaseAdmin
            .from('categories')
            .insert(data)
            .select()
            .single();

        if (error) {
            logger.error('Error creating category:', error);
            throw new Error(error.message);
        }

        return category;
    }

    static async updateCategory(data: UpdateCategoryRequest) {
        const {data: category, error} = await supabaseAdmin
            .from('categories')
            .update(data)
            .eq('id', data.id)
            .select()
            .single();

        if (error) {
            logger.error('Error updating category:', error);
            throw new Error(error.message);
        }

        return category;
    }

    static async createProduct(data: CreateProductRequest) {
        const {data: product, error} = await supabaseAdmin
            .from('products')
            .insert(data)
            .select()
            .single();

        if (error) {
            logger.error('Error creating product:', error);
            throw new Error(error.message);
        }

        return product;
    }

    static async updateProduct(data: UpdateProductRequest) {
        const {data: product, error} = await supabaseAdmin
            .from('products')
            .update(data)
            .eq('id', data.id)
            .select()
            .single();

        if (error) {
            logger.error('Error updating product:', error);
            throw new Error(error.message);
        }

        return product;
    }
}
