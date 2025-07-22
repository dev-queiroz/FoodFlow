import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {RestaurantService} from './service';
import {Restaurant, RestaurantPublic} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateIdParam, validateText} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const restaurantService = new RestaurantService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
];

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem criar restaurantes'),
        validateText('name'),
        validateText('description', true),
        validateText('address', true),
        validateText('contact_number', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const restaurant: Restaurant = await restaurantService.createRestaurant(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(restaurant);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Papel inválido'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const restaurants: Restaurant[] | RestaurantPublic[] = await restaurantService.listRestaurants((req as any).userId, (req as any).user.role_id);
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
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem atualizar restaurantes'),
        validateText('name', true),
        validateText('description', true),
        validateText('address', true),
        validateText('contact_number', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await restaurantService.updateRestaurant(req.params.id, req.body, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Restaurante atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        validateIdParam(),
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem excluir restaurantes'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await restaurantService.deleteRestaurant(req.params.id, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Restaurante excluído com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
)

export default router;