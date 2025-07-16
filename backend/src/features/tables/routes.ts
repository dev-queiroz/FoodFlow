import {Request, Response, Router} from 'express';
import {TableService} from './service';
import {QrCodeResponse, Table} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateIdParam, validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import {body} from 'express-validator';

const router = Router();
const tableService = new TableService();

// Criar Mesa
router.post(
    '/',
    [
        validateUUID('restaurant_id'),
        body('table_number').isInt({min: 1}).withMessage('Número da mesa deve ser um inteiro positivo'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const table: Table = await tableService.createTable(req.body, (req as any).userId);
            res.status(201).json(table);
        } catch (err: any) {
            throw err;
        }
    }
);

// Listar Mesas
router.get(
    '/:restaurantId',
    [validateIdParam().customSanitizer((value) => value).withMessage('ID do restaurante inválido'), authMiddleware],
    async (req: Request, res: Response) => {
        try {
            const restaurants: Table[] = await tableService.listTables(req.params.restaurantId, (req as any).userId);
            res.json(restaurants);
        } catch (err: any) {
            throw err;
        }
    }
);

// Atualizar Mesa
router.put(
    '/:id',
    [
        validateIdParam(),
        body('table_number').optional().isInt({min: 1}).withMessage('Número da mesa deve ser um inteiro positivo'),
        body('status')
            .optional()
            .isIn(['available', 'occupied', 'reserved'])
            .withMessage('Status deve ser available, occupied ou reserved'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await tableService.updateTable(req.params.id, req.body, (req as any).userId);
            res.json({message: 'Mesa atualizada com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

// Excluir Mesa
router.delete('/:id', [validateIdParam(), handleValidationErrors, authMiddleware], async (req: Request, res: Response) => {
    try {
        await tableService.deleteTable(req.params.id, (req as any).userId);
        res.json({message: 'Mesa excluída com sucesso'});
    } catch (err: any) {
        throw err;
    }
});

// Validar QR Code
router.post(
    '/validate-qr',
    [validateText('qr_code'), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            const response: QrCodeResponse = await tableService.validateQrCode(req.body);
            res.json(response);
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;