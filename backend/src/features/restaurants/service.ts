import {supabase} from '../../config/supabase';
import {CreateRestaurantDto, Restaurant, UpdateRestaurantDto} from './interfaces';

export class RestaurantService {
    async createRestaurant(dto: CreateRestaurantDto, ownerId: string): Promise<Restaurant> {
        const {name, description, address, contact_number} = dto;

        const {data, error} = await supabase
            .from('restaurants')
            .insert({
                name,
                description,
                address,
                contact_number,
                owner_id: ownerId,
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar restaurante:', error.message);
            throw new Error(`Erro ao criar restaurante: ${error.message}`);
        }

        return data;
    }

    async listRestaurants(ownerId: string): Promise<Restaurant[]> {
        const {data, error} = await supabase
            .from('restaurants')
            .select('*')
            .eq('owner_id', ownerId);

        if (error) {
            console.error('Erro ao listar restaurantes:', error.message);
            throw new Error(`Erro ao listar restaurantes: ${error.message}`);
        }

        return data;
    }

    async listAllRestaurants(): Promise<Restaurant[]> {
        const {data, error} = await supabase.from('restaurants').select('*');

        if (error) {
            console.error('Erro ao listar todos os restaurantes:', error.message);
            throw new Error(`Erro ao listar todos os restaurantes: ${error.message}`);
        }

        return data;
    }

    async updateRestaurant(id: string, dto: UpdateRestaurantDto, ownerId: string): Promise<void> {
        const {name, description, address, contact_number} = dto;

        const {error} = await supabase
            .from('restaurants')
            .update({name, description, address, contact_number})
            .eq('id', id)
            .eq('owner_id', ownerId);

        if (error) {
            console.error('Erro ao atualizar restaurante:', error.message);
            throw new Error(`Erro ao atualizar restaurante: ${error.message}`);
        }
    }

    async deleteRestaurant(id: string, ownerId: string): Promise<void> {
        const {error} = await supabase
            .from('restaurants')
            .delete()
            .eq('id', id)
            .eq('owner_id', ownerId);

        if (error) {
            console.error('Erro ao excluir restaurante:', error.message);
            throw new Error(`Erro ao excluir restaurante: ${error.message}`);
        }
    }
}