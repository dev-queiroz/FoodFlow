import {Request, Response, Router} from 'express';
import {SessionService} from './service';
import {Session} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateIdParam, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import {body} from 'express-validator';

const router = Router();
const sessionService = new SessionService();

// Criar Sessão
router.post(
    '/',
    [
        validateUUID('table_id'),
        validateUUID('client_id', true),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const session: Session = await sessionService.createSession(req.body, (req as any).userId);
            res.status(201).json(session);
        } catch (err: any) {
            throw err;
        }
    }
);

// Listar Sessões
router.get(
    '/:restaurantId',
    [validateIdParam().customSanitizer((value) => value).withMessage('ID do restaurante inválido'), authMiddleware],
    async (req: Request, res: Response) => {
        try {
            const sessions: Session[] = await sessionService.listSessions(req.params.restaurantId, (req as any).userId);
            res.json(sessions);
        } catch (err: any) {
            throw err;
        }
    }
);

// Atualizar Sessão
router.put(
    '/:id',
    [
        validateIdParam(),
        body('status').optional().isIn(['active', 'closed']).withMessage('Status deve ser active ou closed'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await sessionService.updateSession(req.params.id, req.body, (req as any).userId);
            res.json({message: 'Sessão atualizada com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

// Excluir Sessão
router.delete('/:id', [validateIdParam(), handleValidationErrors, authMiddleware], async (req: Request, res: Response) => {
    try {
        await sessionService.deleteSession(req.params.id, (req as any).userId);
        res.json({message: 'Sessão excluída com sucesso'});
    } catch (err: any) {
        throw err;
    }
});

export default router;