import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {TableService} from './service';
import {QrCodeResponse, Table} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {handleValidationErrors} from '../../utils/errorHandler';
import {validateText, validateUUID} from '../../utils/validator';

const router = Router();
const tableService = new TableService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
];

router.post(
    '/',
    [
        authMiddleware,
        validateUUID('restaurant_id'),
        body('table_number').isInt({min: 1}).withMessage('Número da mesa deve ser um inteiro positivo'),
        body('capacity').isInt({min: 1}).withMessage('Capacidade deve ser um número inteiro positivo'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role_id !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
                return res.status(403).json({message: 'Apenas donos podem criar mesas'});
            }
            const table: Table = await tableService.createTable(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(table);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [authMiddleware, validateUUID('restaurantId', false, true), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            if (!allowedRoles.includes((req as any).user.role_id)) {
                return res.status(403).json({message: 'Apenas donos, cozinheiros ou garçons podem listar mesas'});
            }
            const tables: Table[] = await tableService.listTables(req.params.restaurantId, (req as any).userId, (req as any).user.role_id);
            res.json(tables);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        validateUUID('id', false, true),
        body('table_number').optional().isInt({min: 1}).withMessage('Número da mesa deve ser um inteiro positivo'),
        body('status')
            .optional()
            .isIn(['available', 'occupied', 'reserved'])
            .withMessage('Status deve ser available, occupied ou reserved'),
        body('capacity').optional().isInt({min: 1}).withMessage('Capacidade deve ser um número inteiro positivo'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            if (!['09603787-2fca-4e4c-9e6c-7b349232c512', '3f3aed51-f815-40dc-a372-a31de658319f'].includes((req as any).user.role_id)) {
                return res.status(403).json({message: 'Apenas donos ou garçons podem atualizar mesas'});
            }
            await tableService.updateTable(req.params.id, req.body, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Mesa atualizada com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [authMiddleware, validateUUID('id', false, true), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role_id !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
                return res.status(403).json({message: 'Apenas donos podem excluir mesas'});
            }
            await tableService.deleteTable(req.params.id, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Mesa excluída com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

router.post(
    '/validate-qr',
    [
        authMiddleware,
        validateText('qr_code'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role_id !== 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
                return res.status(403).json({message: 'Apenas clientes podem validar QR codes'});
            }
            const response: QrCodeResponse = await tableService.validateQrCode(req.body, (req as any).user.role_id, (req as any).userId);
            res.json(response);
        } catch (err: any) {
            throw err;
        }
    }
);

router.post(
    '/close-session',
    [
        authMiddleware,
        validateText('qr_code'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const allowedRoles = [
                'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // Cliente
                '3f3aed51-f815-40dc-a372-a31de658319f', // Garçom
                '09603787-2fca-4e4c-9e6c-7b349232c512', // Dono
            ];
            if (!allowedRoles.includes((req as any).user.role_id)) {
                return res.status(403).json({message: 'Apenas clientes, garçons ou donos podem fechar sessões'});
            }
            await tableService.closeSession(req.body.qr_code, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Sessão fechada e mesa liberada com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;