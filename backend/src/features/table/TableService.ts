// src/features/tables/services/TableService.ts

import {supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {CreateTableRequest, UpdateTableRequest} from './types';

export class TableService {
    static async createTable(data: CreateTableRequest) {
        const {data: table, error} = await supabaseAdmin
            .from('tables')
            .insert(data)
            .select()
            .single();

        if (error || !table) {
            logger.error('Error creating table:', error);
            throw new Error(error?.message || 'Failed to create table');
        }

        return table;
    }

    static async updateTable(data: UpdateTableRequest) {
        const {id, ...updateData} = data;

        const {data: table, error} = await supabaseAdmin
            .from('tables')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            logger.error('Error updating table:', error);
            throw new Error(error.message);
        }

        return table;
    }

    static async getTableQRCode(table_id: string): Promise<string> {
        return `https://foodflow.agency/table/${table_id}`;
    }
}
