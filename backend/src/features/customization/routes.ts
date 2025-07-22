import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {CustomizationService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import fileUpload from "express-fileupload";

const router = Router();
const customizationService = new CustomizationService();

const allowedOwnerRole = ['09603787-2fca-4e4c-9e6c-7b349232c512']; // dono

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedOwnerRole).withMessage('Apenas donos podem criar ou atualizar configurações'),
        validateUUID('restaurant_id'),
        body('primary_color').matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Cor primária deve ser hexadecimal (#RRGGBB)'),
        body('secondary_color').matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Cor secundária deve ser hexadecimal (#RRGGBB)'),
        body('logo').custom((value, {req}) => {
            const files = (req as any).files; // Tipagem temporária para compatibilidade
            if (files?.logo && !['image/jpeg', 'image/png'].includes(files.logo.mimetype)) {
                throw new Error('Logo deve ser JPEG ou PNG');
            }
            return true;
        }),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const files = (req as any).files; // Tipagem temporária
            const input = {
                ...req.body,
                logo: files?.logo as fileUpload.UploadedFile, // Usar tipo do express-fileupload
            };
            const customization = await customizationService.createOrUpdateCustomization(input, (req as any).userId);
            res.status(201).json(customization);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [validateUUID('restaurantId'), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            const customization = await customizationService.getCustomization(req.params.restaurantId);
            res.json(customization);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:restaurantId',
    [
        authMiddleware,
        body('role_id').isIn(allowedOwnerRole).withMessage('Apenas donos podem excluir configurações'),
        validateUUID('restaurantId'),
        handleValidationErrors,
    ],
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