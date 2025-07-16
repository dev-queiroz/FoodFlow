import {Request, Response, Router} from 'express';
import {RestaurantService} from './service';
import {Restaurant} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateIdParam, validateText} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import {supabase} from '../../config/supabase';

const router = Router();
const restaurantService = new RestaurantService();

// Criar Restaurante
router.post(
    '/',
    [
        validateText('name'),
        validateText('description', true),
        validateText('address', true),
        validateText('contact_number', true),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const restaurant: Restaurant = await restaurantService.createRestaurant(req.body, (req as any).userId);
            res.status(201).json(restaurant);
        } catch (err: any) {
            throw err;
        }
    }
);

// Listar Restaurantes do Dono
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    try {
        const restaurants: Restaurant[] = await restaurantService.listRestaurants((req as any).userId);
        res.json(restaurants);
    } catch (err: any) {
        throw err;
    }
});

// Listar Todos os Restaurantes (para clientes)
router.get('/all', async (req: Request, res: Response) => {
    try {
        const restaurants: Restaurant[] = await restaurantService.listAllRestaurants();
        res.json(restaurants);
    } catch (err: any) {
        throw err;
    }
});

// Atualizar Restaurante
router.put(
    '/:id',
    [
        validateIdParam(),
        validateText('name', true),
        validateText('description', true),
        validateText('address', true),
        validateText('contact_number', true),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            // Verificar se o usuário é o dono do restaurante
            const {data, error} = await supabase
                .from('restaurants')
                .select('owner_id')
                .eq('id', req.params.id)
                .single();
            if (error || !data || data.owner_id !== (req as any).userId) {
                return res.status(403).json({message: 'Acesso negado: você não é o dono deste restaurante'});
            }

            await restaurantService.updateRestaurant(req.params.id, req.body, (req as any).userId);
            res.json({message: 'Restaurante atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

// Excluir Restaurante
router.delete('/:id', [validateIdParam(), handleValidationErrors, authMiddleware], async (req: Request, res: Response) => {
    try {
        // Verificar se o usuário é o dono do restaurante
        const {data, error} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', req.params.id)
            .single();
        if (error || !data || data.owner_id !== (req as any).userId) {
            return res.status(403).json({message: 'Acesso negado: você não é o dono deste restaurante'});
        }

        await restaurantService.deleteRestaurant(req.params.id, (req as any).userId);
        res.json({message: 'Restaurante excluído com sucesso'});
    } catch (err: any) {
        throw err;
    }
});

export default router;