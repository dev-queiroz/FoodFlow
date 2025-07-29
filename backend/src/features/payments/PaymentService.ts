import {supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {CreatePaymentRequest, UpdatePaymentRequest} from './types';

export class PaymentService {
    static async createPayment(data: CreatePaymentRequest) {
        const {data: payment, error} = await supabaseAdmin
            .from('payments')
            .insert(data)
            .select()
            .single();

        if (error || !payment) {
            logger.error('Error creating payment:', error);
            throw new Error(error?.message || 'Failed to create payment');
        }

        return payment;
    }

    static async updatePaymentStatus(data: UpdatePaymentRequest) {
        const {id, status} = data;

        const {data: payment, error} = await supabaseAdmin
            .from('payments')
            .update({status})
            .eq('id', id)
            .select()
            .single();

        if (error) {
            logger.error('Error updating payment status:', error);
            throw new Error(error.message);
        }

        return payment;
    }
}
