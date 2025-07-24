import {Request, Response, Router} from 'express';
import {body, query} from 'express-validator';
import {FeedbackService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const feedbackService = new FeedbackService();

const allowedClientRole = ['e7256f9b-9f57-4fde-b15e-0bdefb0390f6']; // cliente
const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
];

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedClientRole).withMessage('Apenas clientes podem criar feedback'),
        validateUUID('restaurant_id'),
        validateUUID('order_id', true),
        body('rating').isInt({min: 1, max: 5}).withMessage('Nota deve ser entre 1 e 5'),
        validateText('comment', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const feedback = await feedbackService.createFeedback(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(feedback);
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
        validateUUID('order_id', true),
        query('rating').optional().isInt({min: 1, max: 5}).withMessage('Nota deve ser entre 1 e 5'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                order_id: req.query.order_id as string | undefined,
                rating: req.query.rating ? parseInt(req.query.rating as string) : undefined,
            };
            const feedbacks = await feedbackService.listFeedback(req.params.restaurantId, (req as any).userId, (req as any).user.role_id, filter);
            res.json(feedbacks);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedClientRole).withMessage('Apenas clientes podem atualizar feedback'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        validateUUID('order_id', true),
        body('rating').optional().isInt({min: 1, max: 5}).withMessage('Nota deve ser entre 1 e 5'),
        validateText('comment', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const feedback = await feedbackService.updateFeedback(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id, req.body);
            res.json(feedback);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await feedbackService.deleteFeedback(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;