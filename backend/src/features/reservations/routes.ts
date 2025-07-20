import {Request, Response, Router} from 'express';
import {ReservationService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import {body, query} from 'express-validator';

const router = Router();
const reservationService = new ReservationService();

router.post(
    '/',
    [
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('user_id').optional().isUUID().withMessage('ID do usuário deve ser um UUID válido'),
        body('table_id').optional().isUUID().withMessage('ID da mesa deve ser um UUID válido'),
        body('reservation_date').isISO8601().withMessage('Data da reserva deve ser um formato ISO 8601 válido'),
        body('number_of_guests').isInt({min: 1}).withMessage('Número de convidados deve ser um inteiro positivo'),
        body('notes').optional().isString().withMessage('Notas devem ser uma string'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const reservation = await reservationService.createReservation(req.body, (req as any).userId);
            res.status(201).json(reservation);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [
        validateUUID('restaurantId'),
        query('start_date').optional().isISO8601().withMessage('Data inicial deve ser um formato ISO 8601 válido'),
        query('end_date').optional().isISO8601().withMessage('Data final deve ser um formato ISO 8601 válido'),
        query('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Status deve ser pending, confirmed ou cancelled'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                start_date: req.query.start_date as string,
                end_date: req.query.end_date as string,
                status: req.query.status as 'pending' | 'confirmed' | 'cancelled' | undefined,
            };
            const reservations = await reservationService.listReservations(req.params.restaurantId, (req as any).userId, filter);
            res.json(reservations);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        validateUUID('id'),
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('user_id').optional().isUUID().withMessage('ID do usuário deve ser um UUID válido'),
        body('table_id').optional().isUUID().withMessage('ID da mesa deve ser um UUID válido'),
        body('reservation_date').optional().isISO8601().withMessage('Data da reserva deve ser um formato ISO 8601 válido'),
        body('number_of_guests').optional().isInt({min: 1}).withMessage('Número de convidados deve ser um inteiro positivo'),
        body('notes').optional().isString().withMessage('Notas devem ser uma string'),
        body('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Status deve ser pending, confirmed ou cancelled'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const reservation = await reservationService.updateReservation(req.params.id, req.body.restaurant_id, (req as any).userId, req.body);
            res.json(reservation);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        validateUUID('id'),
        query('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await reservationService.deleteReservation(req.params.id, req.query.restaurant_id as string, (req as any).userId);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;