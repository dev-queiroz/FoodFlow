import {body, param, ValidationChain} from 'express-validator';

export const validateEmail = (): ValidationChain =>
    body('email').isEmail().withMessage('E-mail inválido');

export const validatePassword = (): ValidationChain =>
    body('password').isLength({min: 6}).withMessage('Senha deve ter pelo menos 6 caracteres');

export const validateName = (optional = false): ValidationChain =>
    optional
        ? body('name').optional().notEmpty().withMessage('Nome não pode ser vazio')
        : body('name').notEmpty().withMessage('Nome é obrigatório');

export const validateUUID = (field: string, optional = false, isParam = false) => {
    const validator = (value: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
            throw new Error(`${field} inválido`);
        }
        return true;
    };

    const middleware = isParam ? param(field) : body(field);
    return optional
        ? middleware.optional().custom(validator)
        : middleware.notEmpty().withMessage(`${field} é obrigatório`).custom(validator);
};

export const validateIdParam = (): ValidationChain =>
    param('id').isUUID().withMessage('ID inválido');

export const validateText = (field: string, optional = false) => {
    return optional
        ? body(field).optional().isString().withMessage(`${field} deve ser uma string`)
        : body(field).notEmpty().withMessage(`${field} é obrigatório`).isString().withMessage(`${field} deve ser uma string`);
};