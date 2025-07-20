import {supabase} from '../../config/supabase';
import {Customization, CustomizationInput} from './interfaces';

export class CustomizationService {
    async createOrUpdateCustomization(input: CustomizationInput, ownerId: string): Promise<Customization> {
        const {restaurant_id, primary_color, secondary_color, logo_url} = input;

        // Validar restaurante e propriedade
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        // Validar formato das cores (hexadecimal)
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        if (!hexColorRegex.test(primary_color) || !hexColorRegex.test(secondary_color)) {
            throw new Error('Cores devem estar no formato hexadecimal (#RRGGBB)');
        }

        // Verificar se já existe uma configuração para o restaurante
        const {data: existingSettings, error: fetchError} = await supabase
            .from('restaurant_settings')
            .select('*')
            .eq('restaurant_id', restaurant_id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Erro ao buscar configuração:', fetchError.message);
            throw new Error(`Erro ao buscar configuração: ${fetchError.message}`);
        }

        let result;
        if (existingSettings) {
            // Atualizar configuração existente
            result = await supabase
                .from('restaurant_settings')
                .update({primary_color, secondary_color, logo_url})
                .eq('restaurant_id', restaurant_id)
                .select()
                .single();
        } else {
            // Criar nova configuração
            result = await supabase
                .from('restaurant_settings')
                .insert({restaurant_id, primary_color, secondary_color, logo_url})
                .select()
                .single();
        }

        if (result.error) {
            console.error('Erro ao salvar configuração:', result.error.message);
            throw new Error(`Erro ao salvar configuração: ${result.error.message}`);
        }

        return result.data as Customization;
    }

    async getCustomization(restaurantId: string): Promise<Customization | null> {
        const {data, error} = await supabase
            .from('restaurant_settings')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar configuração:', error.message);
            throw new Error(`Erro ao buscar configuração: ${error.message}`);
        }

        return data as Customization | null;
    }

    async deleteCustomization(restaurantId: string, ownerId: string): Promise<void> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {error} = await supabase
            .from('restaurant_settings')
            .delete()
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao excluir configuração:', error.message);
            throw new Error(`Erro ao excluir configuração: ${error.message}`);
        }
    }
}