import {Request, Response, Router} from 'express';
import {CustomizationService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from "../../utils/errorHandler";
import {body} from 'express-validator';

const router = Router();
const customizationService = new CustomizationService();

router.post(
    '/',
    [
        body('restaurant_id').isUUID().withMessage('restaurant_id deve ser um UUID válido'),
        body('primary_color').matches(/^#[0-9A-Fa-f]{6}$/).withMessage('primary_color deve ser um código hexadecimal (#RRGGBB)'),
        body('secondary_color').matches(/^#[0-9A-Fa-f]{6}$/).withMessage('secondary_color deve ser um código hexadecimal (#RRGGBB)'),
        body('logo_url').optional().isURL().withMessage('logo_url deve ser uma URL válida'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const customization = await customizationService.createOrUpdateCustomization(req.body, (req as any).userId);
            res.status(201).json(customization);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [validateUUID('restaurantId')],
    async (req: Request, res: Response) => {
        try {
            const customization = await customizationService.getCustomization(req.params.restaurantId);
            if (!customization) {
                return res.status(404).json({message: 'Configuração não encontrada'});
            }
            res.json(customization);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:restaurantId',
    [validateUUID('restaurantId'), authMiddleware],
    async (req: Request, res: Response) => {
        try {
            await customizationService.deleteCustomization(req.params.restaurantId, (req as any).userId);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;