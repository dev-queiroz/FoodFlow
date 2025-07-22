import {supabase} from '../../config/supabase';
import {Feedback, FeedbackFilter, FeedbackInput} from './interfaces';
import {NotificationService} from '../notifications/service';

export class FeedbackService {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    private containsOffensiveLanguage(text: string): boolean {
        const offensiveWords = ['merda', 'porra', 'caralho', 'puta', 'viado', 'fuck', 'shit'];
        return offensiveWords.some(word => text.toLowerCase().includes(word));
    }

    async createFeedback(input: FeedbackInput, userId: string, roleId: string): Promise<Feedback> {
        if (roleId !== 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            throw new Error('Acesso negado: apenas clientes podem criar feedback');
        }

        if (input.comment && this.containsOffensiveLanguage(input.comment)) {
            throw new Error('O comentário contém linguagem ofensiva não permitida');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('id, owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        if (input.order_id) {
            const {data: order, error: orderError} = await supabase
                .from('orders')
                .select('id, user_id')
                .eq('id', input.order_id)
                .eq('restaurant_id', input.restaurant_id)
                .eq('user_id', userId)
                .single();
            if (orderError || !order) {
                throw new Error('Pedido não encontrado ou não pertence ao cliente');
            }
        }

        if (input.rating < 1 || input.rating > 5) {
            throw new Error('Nota deve ser entre 1 e 5');
        }

        const {data, error} = await supabase
            .from('feedback')
            .insert({
                restaurant_id: input.restaurant_id,
                user_id: userId,
                order_id: input.order_id || null,
                rating: input.rating,
                comment: input.comment || null,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar feedback: ${error.message}`);
        }

        if (input.rating <= 2) {
            await this.notificationService.createNotification({
                restaurant_id: input.restaurant_id,
                user_id: restaurant.owner_id,
                title: 'Feedback Negativo Recebido',
                message: `Um novo feedback com nota ${input.rating} foi registrado para seu restaurante.`,
                type: 'feedback',
            }, restaurant.owner_id, '09603787-2fca-4e4c-9e6c-7b349232c512');
        }

        return data as Feedback;
    }

    async listFeedback(restaurantId: string, userId: string, roleId: string, filter: FeedbackFilter): Promise<Feedback[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        let query = supabase.from('feedback').select('*').eq('restaurant_id', restaurantId);

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            query = query.eq('user_id', userId);
        } else if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512' && restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: apenas o dono pode listar todos os feedbacks');
        }

        if (filter.order_id) {
            query = query.eq('order_id', filter.order_id);
        }
        if (filter.rating) {
            query = query.eq('rating', filter.rating);
        }

        const {data, error} = await query;

        if (error) {
            throw new Error(`Erro ao listar feedbacks: ${error.message}`);
        }

        return data as Feedback[];
    }

    async updateFeedback(id: string, restaurantId: string, userId: string, roleId: string, input: Partial<FeedbackInput>): Promise<Feedback> {
        if (roleId !== 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            throw new Error('Acesso negado: apenas clientes podem atualizar feedback');
        }

        if (input.comment && this.containsOffensiveLanguage(input.comment)) {
            throw new Error('O comentário contém linguagem ofensiva não permitida');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('id, owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        const {data: feedback, error: feedbackError} = await supabase
            .from('feedback')
            .select('id, user_id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .eq('user_id', userId)
            .single();
        if (feedbackError || !feedback) {
            throw new Error('Feedback não encontrado ou acesso negado');
        }

        if (input.order_id) {
            const {data: order, error: orderError} = await supabase
                .from('orders')
                .select('id, user_id')
                .eq('id', input.order_id)
                .eq('restaurant_id', restaurantId)
                .eq('user_id', userId)
                .single();
            if (orderError || !order) {
                throw new Error('Pedido não encontrado ou não pertence ao cliente');
            }
        }

        if (input.rating && (input.rating < 1 || input.rating > 5)) {
            throw new Error('Nota deve ser entre 1 e 5');
        }

        const updateData: Partial<Feedback> = {};
        if (input.rating) updateData.rating = input.rating;
        if (input.comment !== undefined) updateData.comment = input.comment;
        if (input.order_id !== undefined) updateData.order_id = input.order_id;

        if (Object.keys(updateData).length === 0) {
            throw new Error('Nenhum dado fornecido para atualização');
        }

        const {data, error} = await supabase
            .from('feedback')
            .update(updateData)
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar feedback: ${error.message}`);
        }

        if (input.rating && input.rating <= 2) {
            await this.notificationService.createNotification({
                restaurant_id: restaurantId,
                user_id: restaurant.owner_id,
                title: 'Feedback Negativo Atualizado',
                message: `Um feedback foi atualizado com nota ${input.rating} em seu restaurante.`,
                type: 'feedback'
            }, restaurant.owner_id, '09603787-2fca-4e4c-9e6c-7b349232c512');
        }

        return data as Feedback;
    }

    async deleteFeedback(id: string, restaurantId: string, userId: string, roleId: string): Promise<void> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        const {data: feedback, error: feedbackError} = await supabase
            .from('feedback')
            .select('id, user_id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (feedbackError || !feedback) {
            throw new Error('Feedback não encontrado');
        }

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6' && feedback.user_id !== userId) {
            throw new Error('Acesso negado: apenas o autor pode excluir');
        }
        if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512' && restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: apenas o dono do restaurante pode excluir');
        }

        const {error} = await supabase
            .from('feedback')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            throw new Error(`Erro ao excluir feedback: ${error.message}`);
        }
    }
}