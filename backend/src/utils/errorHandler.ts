import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Erros de validação:', JSON.stringify(errors.array()));
        return res.status(400).json({
            errors: errors.array().map((err: any) => ({
                type: err.type,
                msg: err.msg,
                path: err.path,
                location: err.location,
            })),
        });
    }
    next();
};

export function handleErrors(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Erro:', err.message);
    res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor' });
}