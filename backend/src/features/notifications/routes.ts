import {Request, Response, Router} from 'express';
import {body, query} from 'express-validator';
import {NotificationService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const notificationService = new NotificationService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
];

const allowedCreateRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
];

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedCreateRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurant_id'),
        validateUUID('user_id', true),
        validateText('title'),
        validateText('message'),
        body('type').isIn(['reservation', 'order', 'other']).withMessage('Tipo deve ser reservation, order ou other'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const notification = await notificationService.createNotification(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(notification);
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
        query('type').optional().isIn(['reservation', 'order', 'other']).withMessage('Tipo deve ser reservation, order ou other'),
        query('status').optional().isIn(['unread', 'read']).withMessage('Status deve ser unread ou read'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                type: req.query.type as 'reservation' | 'order' | 'other' | undefined,
                status: req.query.status as 'unread' | 'read' | undefined,
            };
            const notifications = await notificationService.listNotifications(req.params.restaurantId, (req as any).userId, (req as any).user.role_id, filter);
            res.json(notifications);
        } catch (err: any) {
            throw err;
        }
    }
);

router.patch(
    '/:id/read',
    [
        authMiddleware,
        validateUUID('id'),
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const notification = await notificationService.markNotificationAsRead(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.json(notification);
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;