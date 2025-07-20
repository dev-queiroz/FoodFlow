import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {TableService} from './service';
import {QrCodeResponse, Table} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {handleValidationErrors} from '../../utils/errorHandler';
import {validateText, validateUUID} from '../../utils/validator';

const router = Router();
const tableService = new TableService();

// Criar Mesa
router.post(
    '/',
    [
        authMiddleware,
        body('restaurant_id').notEmpty().withMessage('restaurant_id é obrigatório'),
        validateUUID('restaurant_id'),
        body('table_number').isInt({min: 1}).withMessage('Número da mesa deve ser um inteiro positivo'),
        body('capacity').isInt({min: 1}).withMessage('Capacidade deve ser um número inteiro positivo'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            console.log('Criando mesa com dados:', req.body);
            const table: Table = await tableService.createTable(req.body, (req as any).userId);
            console.log('Mesa criada com sucesso:', table);
            res.status(201).json(table);
        } catch (err: any) {
            console.error('Erro ao criar mesa:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

// Listar Mesas
router.get(
    '/:restaurantId',
    [authMiddleware, validateUUID('restaurantId', false, true), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            console.log(`Listando mesas para restaurantId: ${req.params.restaurantId}`);
            const tables: Table[] = await tableService.listTables(req.params.restaurantId, (req as any).userId);
            console.log('Mesas encontradas:', tables);
            res.json(tables);
        } catch (err: any) {
            console.error('Erro ao listar mesas:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

// Atualizar Mesa
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
            console.log('Atualizando mesa:', req.params.id, req.body);
            await tableService.updateTable(req.params.id, req.body, (req as any).userId);
            res.json({message: 'Mesa atualizada com sucesso'});
        } catch (err: any) {
            console.error('Erro ao atualizar mesa:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

// Excluir Mesa
router.delete(
    '/:id',
    [authMiddleware, validateUUID('id', false, true), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            console.log('Excluindo mesa:', req.params.id);
            await tableService.deleteTable(req.params.id, (req as any).userId);
            res.json({message: 'Mesa excluída com sucesso'});
        } catch (err: any) {
            console.error('Erro ao excluir mesa:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

// Validar QR Code
router.post(
    '/validate-qr',
    [validateText('qr_code'), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            console.log('Validando QR code:', req.body.qr_code);
            const response: QrCodeResponse = await tableService.validateQrCode(req.body);
            console.log('QR code válido:', response);
            res.json(response);
        } catch (err: any) {
            console.error('Erro ao validar QR code:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

export default router;