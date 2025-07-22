import {Request, Response, Router} from 'express';
import {QRCodeService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import {body} from "express-validator";

const router = Router();
const qrCodeService = new QRCodeService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
];

router.get(
    '/:restaurantId',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurantId'),
        validateUUID('table_id', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                table_id: req.query.table_id as string | undefined,
            };
            const qrCodes = await qrCodeService.listQRCodes(req.params.restaurantId, (req as any).userId, (req as any).user.role_id, filter);
            res.json(qrCodes);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:id/download',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const qrCodeImage = await qrCodeService.downloadQRCode(req.params.id, (req as any).userId, (req as any).user.role_id);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `attachment; filename=qr-code-${req.params.id}.png`);
            res.send(qrCodeImage);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem excluir QR codes'),
        validateUUID('id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await qrCodeService.deleteQRCode(req.params.id, (req as any).userId, (req as any).user.role_id);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;