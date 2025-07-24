import {Request, Response, Router} from 'express';
import {RestaurantService} from './service';
import {Restaurant, RestaurantPublic} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateIdParam, validateText} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const restaurantService = new RestaurantService();

router.post(
    '/',
    [
        authMiddleware,
        validateText('name'),
        validateText('description', true),
        validateText('address', true),
        validateText('contact_number', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const restaurant: Restaurant = await restaurantService.createRestaurant(
                req.body,
                (req as any).userId,
                (req as any).user.role_id
            );
            res.status(201).json(restaurant);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/',
    [authMiddleware, handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            const restaurants: Restaurant[] | RestaurantPublic[] = await restaurantService.listRestaurants(
                (req as any).userId,
                (req as any).user.role_id
            );
            res.json(restaurants);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        validateIdParam(),
        validateText('name', true),
        validateText('description', true),
        validateText('address', true),
        validateText('contact_number', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await restaurantService.updateRestaurant(
                req.params.id,
                req.body,
                (req as any).userId,
                (req as any).user.role_id
            );
            res.json({message: 'Restaurante atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [authMiddleware, validateIdParam(), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            await restaurantService.deleteRestaurant(
                req.params.id,
                (req as any).userId,
                (req as any).user.role_id
            );
            res.json({message: 'Restaurante excluído com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;