import {Request, Response, Router} from 'express';
import {body, query} from 'express-validator';
import {ReservationService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const reservationService = new ReservationService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
];

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurant_id'),
        validateUUID('user_id', true),
        validateUUID('table_id', true),
        body('reservation_date').isISO8601().withMessage('Data da reserva deve ser um formato ISO 8601 válido'),
        body('number_of_guests').isInt({min: 1}).withMessage('Número de convidados deve ser um inteiro positivo'),
        validateText('notes', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const reservationDate = new Date(req.body.reservation_date);
            if (reservationDate <= new Date()) {
                throw new Error('Data da reserva deve ser futura');
            }
            const reservation = await reservationService.createReservation(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(reservation);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurantId'),
        query('start_date').optional().isISO8601().withMessage('Data inicial deve ser um formato ISO 8601 válido'),
        query('end_date').optional().isISO8601().withMessage('Data final deve ser um formato ISO 8601 válido'),
        query('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Status deve ser pending, confirmed ou cancelled'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                start_date: req.query.start_date as string,
                end_date: req.query.end_date as string,
                status: req.query.status as 'pending' | 'confirmed' | 'cancelled' | undefined,
            };
            const reservations = await reservationService.listReservations(req.params.restaurantId, (req as any).userId, (req as any).user.role_id, filter);
            res.json(reservations);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        validateUUID('id'),
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurant_id'),
        validateUUID('user_id', true),
        validateUUID('table_id', true),
        body('reservation_date').optional().isISO8601().withMessage('Data da reserva deve ser um formato ISO 8601 válido'),
        body('number_of_guests').optional().isInt({min: 1}).withMessage('Número de convidados deve ser um inteiro positivo'),
        validateText('notes', true),
        body('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Status deve ser pending, confirmed ou cancelled'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            if (req.body.reservation_date) {
                const reservationDate = new Date(req.body.reservation_date);
                if (reservationDate <= new Date()) {
                    throw new Error('Data da reserva deve ser futura');
                }
            }
            const reservation = await reservationService.updateReservation(
                req.params.id,
                req.body.restaurant_id,
                (req as any).userId,
                (req as any).user.role_id,
                req.body,
                req.body.status
            );
            res.json(reservation);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        validateUUID('id'),
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await reservationService.deleteReservation(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;