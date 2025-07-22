import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {SessionService} from './service';
import {Session} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const sessionService = new SessionService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
];

const allowedDeleteRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
];

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('table_id'),
        validateUUID('user_id', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const session: Session = await sessionService.createSession(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(session);
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
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const sessions: Session[] = await sessionService.listSessions(req.params.restaurantId, (req as any).userId, (req as any).user.role_id);
            res.json(sessions);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        body('status').optional().isIn(['active', 'closed']).withMessage('Status deve ser active ou closed'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await sessionService.updateSession(req.params.id, req.body, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Sessão atualizada com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedDeleteRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await sessionService.deleteSession(req.params.id, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Sessão excluída com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;